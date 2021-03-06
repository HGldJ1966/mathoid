'use strict';


const BBPromise = require('bluebird');
const sUtil = require('../lib/util');
const texvcInfo = require('texvcinfo');
const SVGO = require('svgo');

const HTTPError = sUtil.HTTPError;
const svgo = new SVGO({
    plugins: [
        { convertTransform: false }
    ]
});


/**
 * The main router object
 */
const router = sUtil.router();

/**
 * The main application object reported when this module is require()d
 */
let app;


/* The response headers for different render types */
function outHeaders(data) {
    return {
        svg: {
            'content-type': 'image/svg+xml'
        },
        png: {
            'content-type': 'image/png'
        },
        mml: {
            'content-type': 'application/mathml+xml',
            'x-mathoid-style': data.mathoidStyle
        }
    };
}


function emitError(txt, detail) {
    if (detail === undefined) {
        detail = txt;
    }
    throw new HTTPError({
        status: 400,
        success: false,
        title: 'Bad Request',
        type: 'bad_request',
        detail,
        error: txt
    });
}

function emitFormatError(format) {
    emitError(`Output format ${format} is disabled via config, try setting ` +
        `"${format}: true" to enable ${format} rendering.`);
}

function optimizeSvg(data, req, cb) {
    try {
        svgo.optimize(data.svg, (result) => {
            if (!result.error) {
                data.svg = result.data;
            } else {
                req.logger.log('warn/svgo', result.error);
            }
            cb();
        });
    } catch (e) {
        req.logger.log('warn/svgo', e);
        cb();
    }
}

function handleRequest(res, q, type, outFormat, features, req) {
    let sanitizedTex;
    let feedback;
    const svg = app.conf.svg && /^svg|json|complete$/.test(outFormat);
    const mml = (type !== "MathML") && /^mml|json|complete$/.test(outFormat);
    const png = app.conf.png && /^png|json|complete$/.test(outFormat);
    const info = app.conf.texvcinfo && /^graph|texvcinfo$/.test(outFormat);
    const img = app.conf.img && /^mml|json|complete$/.test(outFormat);
    const speech = (outFormat !== "png") && features.speech || outFormat === "speech";
    const chem = type === "chem";

    if (chem) {
        type = "inline-TeX";
    }
    if ((!app.conf.no_check && /^TeX|inline-TeX$/.test(type)) || info) {
        feedback = texvcInfo.feedback(q, { usemhchem: chem });
        // XXX properly handle errors here!
        if (feedback.success) {
            sanitizedTex = feedback.checked || '';
            q = sanitizedTex;
        } else {
            emitError(`${feedback.error.name}: ${feedback.error.message}`, feedback);
        }
        if (info) {
            if (outFormat === "graph") {
                res.json(texvcInfo.texvcinfo(q, { format: "json", compact: true }));
                return;
            }
            if (info && outFormat === "texvcinfo") {
                res.json(feedback).end();
                return;
            }
        }
    }

    const mathJaxOptions = {
        math: q,
        format: type,
        svg,
        mathoidStyle: img,
        mml,
        speakText: speech,
        png
    };
    if (app.conf.dpi) {
        mathJaxOptions.dpi = app.conf.dpi;
    }
    return new BBPromise((resolve, reject) => {
        app.mjAPI.typeset(mathJaxOptions, data => resolve(data));
    }).then((data) => {
        if (data.errors) {
            emitError(data.errors);
        }
        data.success = true;
        // @deprecated
        data.log = "success";

        // Return the sanitized TeX to the client
        if (sanitizedTex !== undefined) {
            data.sanetex = sanitizedTex;
        }
        if (speech) {
            data.speech = data.speakText;
        }

        function outputResponse() {
            switch (outFormat) {
                case 'json':
                    res.json(data).end();
                    break;
                case 'complete': {
                    const headers = outHeaders(data);
                    Object.keys(headers).forEach((outType) => {
                        if (data[outType]) {
                            data[outType] = {
                                headers: headers[outType],
                                body: data[outType]
                            };
                        }
                    });
                    res.json(data).end();
                    break;
                }
                default:
                    res.set(outHeaders(data)[outFormat]);
                    res.send(data[outFormat]).end();
            }
        }

        if (data.svg && app.conf.svgo) {
            optimizeSvg(data, req, outputResponse);
        } else {
            outputResponse();
        }
    });
}


/**
 * POST /
 * Performs the rendering request
 */
router.post('/:outformat?/', (req, res) => {
    let outFormat;
    let speech = app.conf.speech_on;
    // First some rudimentary input validation
    if (!(req.body.q)) {
        emitError("q (query) post parameter is missing!");
    }
    const q = req.body.q;
    let type = (req.body.type || 'tex').toLowerCase();
    switch (type) {
        case "tex":
            type = "TeX";
            break;
        case "inline-tex":
            type = "inline-TeX";
            break;
        case "mml":
        case "mathml":
            type = "MathML";
            break;
        case "ascii":
        case "asciimathml":
        case "asciimath":
            type = "AsciiMath";
            break;
        case "chem":
            type = "chem";
            break;
        default :
            emitError(`Input format "${type}" is not recognized!`);
    }
    if (req.body.nospeech) {
        speech = false;
    }
    function setOutFormat(fmt) {
        if (app.conf[fmt] || (fmt === 'graph' && app.conf.texvcinfo)) {
            outFormat = fmt;
        } else {
            emitFormatError(fmt);
        }
    }

    if (req.params.outformat) {
        switch (req.params.outformat.toLowerCase()) {
            case "svg":
                setOutFormat('svg');
                break;
            case "png":
                setOutFormat('png');
                break;
            case "texvcinfo":
                setOutFormat('texvcinfo');
                if (!/(chem|tex$)/i.test(type)) {
                    emitError('texvcinfo accepts only tex, inline-tex, or chem as the input type' +
                        `, ${type} given!`);
                }
                break;
            case "graph":
                setOutFormat('graph');
                if (!/tex$/i.test(type)) {
                    emitError('graph accepts only tex or inline-tex as the input type, ' +
                        `${type} given!`);
                }
                break;
            case "json":
                outFormat = "json";
                break;
            case 'complete':
                outFormat = 'complete';
                break;
            case "mml":
            case "mathml":
                outFormat = "mml";
                break;
            case "speech":
                setOutFormat('speech');
                break;
            default:
                emitError(`Output format "${req.params.outformat}" is not recognized!`);
        }
    } else {
        outFormat = "json";
    }
    return handleRequest(res, q, type, outFormat, { speech }, req);

});


module.exports = (appObj) => {

    app = appObj;

    return {
        path: '/',
        skip_domain: true,
        router
    };

};

