'use strict';

/*
 * Simple API tests
 */

/*
 * Could also check out the nock package to record / replay http interactions
 */

var preq = require('preq');
var assert = require('../../utils/assert.js');
var server = require('../../utils/server.js');
var baseURL = server.config.uri;

var testData = [
        {
            query: {
                q: 'E=mc^{2}'
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"upper E equals m c squared\">\n  <semantics>\n    <mrow>\n      <mi>E</mi>\n      <mo>=</mo>\n      <mi>m</mi>\n      <msup>\n        <mi>c</mi>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mn>2</mn>\n        </mrow>\n      </msup>\n    </mrow>\n    <annotation encoding=\"application/x-tex\">E=mc^{2}</annotation>\n  </semantics>\n</math>",
                    "speech": "upper E equals m c squared",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"9.025ex\" height=\"2.676ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -1006.6 3885.6 1152.1\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">upper E equals m c squared</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-45\" d=\"M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-3D\" d=\"M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-6D\" d=\"M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-63\" d=\"M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMATHI-45\" x=\"0\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMAIN-3D\" x=\"1046\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMATHI-6D\" x=\"2107\" y=\"0\"></use>\n<g transform=\"translate(2990,0)\">\n <use xlink:href=\"#E1-MJMATHI-63\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"619\" y=\"583\"></use>\n</g>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -0.338ex; width:9.025ex; height:2.676ex;",
                    "success": true,
                    "log": "success"
                }
            }
        }, {
            query: {
                q: "\\mathbb {R} ",
                type: "tex"
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"double-struck upper R\">\n  <semantics>\n    <mrow class=\"MJX-TeXAtom-ORD\">\n      <mi mathvariant=\"double-struck\">R</mi>\n    </mrow>\n    <annotation encoding=\"application/x-tex\">\\mathbb {R}</annotation>\n  </semantics>\n</math>",
                    "speech": "double-struck upper R",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"1.689ex\" height=\"2.176ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -791.3 727 936.9\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">double-struck upper R</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJAMS-52\" d=\"M17 665Q17 672 28 683H221Q415 681 439 677Q461 673 481 667T516 654T544 639T566 623T584 607T597 592T607 578T614 565T618 554L621 548Q626 530 626 497Q626 447 613 419Q578 348 473 326L455 321Q462 310 473 292T517 226T578 141T637 72T686 35Q705 30 705 16Q705 7 693 -1H510Q503 6 404 159L306 310H268V183Q270 67 271 59Q274 42 291 38Q295 37 319 35Q344 35 353 28Q362 17 353 3L346 -1H28Q16 5 16 16Q16 35 55 35Q96 38 101 52Q106 60 106 341T101 632Q95 645 55 648Q17 648 17 665ZM241 35Q238 42 237 45T235 78T233 163T233 337V621L237 635L244 648H133Q136 641 137 638T139 603T141 517T141 341Q141 131 140 89T134 37Q133 36 133 35H241ZM457 496Q457 540 449 570T425 615T400 634T377 643Q374 643 339 648Q300 648 281 635Q271 628 270 610T268 481V346H284Q327 346 375 352Q421 364 439 392T457 496ZM492 537T492 496T488 427T478 389T469 371T464 361Q464 360 465 360Q469 360 497 370Q593 400 593 495Q593 592 477 630L457 637L461 626Q474 611 488 561Q492 537 492 496ZM464 243Q411 317 410 317Q404 317 401 315Q384 315 370 312H346L526 35H619L606 50Q553 109 464 243Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJAMS-52\" x=\"0\" y=\"0\"></use>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -0.338ex; width:1.689ex; height:2.176ex;",
                    "success": true,
                    "log": "success",
                }
            }
        }, {
            query: {
                type: "asciimath",
                q: "x^2 or a_(m n) or a_{m n} or (x+1)/y or sqrtx"
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" alttext=\"x squared or a Subscript m n Baseline or a Subscript m n Baseline or StartFraction x plus 1 Over y EndFraction or StartRoot x EndRoot\">\n  <semantics>\n    <mstyle displaystyle=\"true\">\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mrow>\n        <mspace width=\"1ex\" />\n        <mtext>or</mtext>\n        <mspace width=\"1ex\" />\n      </mrow>\n      <msub>\n        <mi>a</mi>\n        <mrow>\n          <mi>m</mi>\n          <mi>n</mi>\n        </mrow>\n      </msub>\n      <mrow>\n        <mspace width=\"1ex\" />\n        <mtext>or</mtext>\n        <mspace width=\"1ex\" />\n      </mrow>\n      <msub>\n        <mi>a</mi>\n        <mrow>\n          <mi>m</mi>\n          <mi>n</mi>\n        </mrow>\n      </msub>\n      <mrow>\n        <mspace width=\"1ex\" />\n        <mtext>or</mtext>\n        <mspace width=\"1ex\" />\n      </mrow>\n      <mfrac>\n        <mrow>\n          <mi>x</mi>\n          <mo>+</mo>\n          <mn>1</mn>\n        </mrow>\n        <mi>y</mi>\n      </mfrac>\n      <mrow>\n        <mspace width=\"1ex\" />\n        <mtext>or</mtext>\n        <mspace width=\"1ex\" />\n      </mrow>\n      <msqrt>\n        <mi>x</mi>\n      </msqrt>\n    </mstyle>\n    <annotation encoding=\"text/x-asciimath\">x^2 or a_(m n) or a_{m n} or (x+1)/y or sqrtx</annotation>\n  </semantics>\n</math>",
                    "speech": "x squared or a Subscript m n Baseline or a Subscript m n Baseline or StartFraction x plus 1 Over y EndFraction or StartRoot x EndRoot",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"36.307ex\" height=\"5.676ex\" style=\"vertical-align: -2.338ex;\" viewBox=\"0 -1437.2 15632.3 2443.8\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">x squared or a Subscript m n Baseline or a Subscript m n Baseline or StartFraction x plus 1 Over y EndFraction or StartRoot x EndRoot</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-78\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-6F\" d=\"M28 214Q28 309 93 378T250 448Q340 448 405 380T471 215Q471 120 407 55T250 -10Q153 -10 91 57T28 214ZM250 30Q372 30 372 193V225V250Q372 272 371 288T364 326T348 362T317 390T268 410Q263 411 252 411Q222 411 195 399Q152 377 139 338T126 246V226Q126 130 145 91Q177 30 250 30Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-72\" d=\"M36 46H50Q89 46 97 60V68Q97 77 97 91T98 122T98 161T98 203Q98 234 98 269T98 328L97 351Q94 370 83 376T38 385H20V408Q20 431 22 431L32 432Q42 433 60 434T96 436Q112 437 131 438T160 441T171 442H174V373Q213 441 271 441H277Q322 441 343 419T364 373Q364 352 351 337T313 322Q288 322 276 338T263 372Q263 381 265 388T270 400T273 405Q271 407 250 401Q234 393 226 386Q179 341 179 207V154Q179 141 179 127T179 101T180 81T180 66V61Q181 59 183 57T188 54T193 51T200 49T207 48T216 47T225 47T235 46T245 46H276V0H267Q249 3 140 3Q37 3 28 0H20V46H36Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-61\" d=\"M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-6D\" d=\"M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-6E\" d=\"M21 287Q22 293 24 303T36 341T56 388T89 425T135 442Q171 442 195 424T225 390T231 369Q231 367 232 367L243 378Q304 442 382 442Q436 442 469 415T503 336T465 179T427 52Q427 26 444 26Q450 26 453 27Q482 32 505 65T540 145Q542 153 560 153Q580 153 580 145Q580 144 576 130Q568 101 554 73T508 17T439 -10Q392 -10 371 17T350 73Q350 92 386 193T423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 180T152 343Q153 348 153 366Q153 405 129 405Q91 405 66 305Q60 285 60 284Q58 278 41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-2B\" d=\"M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-31\" d=\"M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-79\" d=\"M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-221A\" d=\"M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMATHI-78\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"816\" y=\"583\"></use>\n<g transform=\"translate(1034,0)\">\n<g transform=\"translate(430,0)\">\n <use xlink:href=\"#E1-MJMAIN-6F\"></use>\n <use xlink:href=\"#E1-MJMAIN-72\" x=\"505\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(2797,0)\">\n <use xlink:href=\"#E1-MJMATHI-61\" x=\"0\" y=\"0\"></use>\n<g transform=\"translate(534,-150)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-6D\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-6E\" x=\"883\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(4483,0)\">\n<g transform=\"translate(430,0)\">\n <use xlink:href=\"#E1-MJMAIN-6F\"></use>\n <use xlink:href=\"#E1-MJMAIN-72\" x=\"505\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(6246,0)\">\n <use xlink:href=\"#E1-MJMATHI-61\" x=\"0\" y=\"0\"></use>\n<g transform=\"translate(534,-150)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-6D\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-6E\" x=\"883\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(7932,0)\">\n<g transform=\"translate(430,0)\">\n <use xlink:href=\"#E1-MJMAIN-6F\"></use>\n <use xlink:href=\"#E1-MJMAIN-72\" x=\"505\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(9695,0)\">\n<g transform=\"translate(120,0)\">\n<rect stroke=\"none\" width=\"2518\" height=\"60\" x=\"0\" y=\"220\"></rect>\n<g transform=\"translate(60,676)\">\n <use xlink:href=\"#E1-MJMATHI-78\" x=\"0\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMAIN-2B\" x=\"843\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMAIN-31\" x=\"1893\" y=\"0\"></use>\n</g>\n <use xlink:href=\"#E1-MJMATHI-79\" x=\"1008\" y=\"-686\"></use>\n</g>\n</g>\n<g transform=\"translate(12454,0)\">\n<g transform=\"translate(430,0)\">\n <use xlink:href=\"#E1-MJMAIN-6F\"></use>\n <use xlink:href=\"#E1-MJMAIN-72\" x=\"505\" y=\"0\"></use>\n</g>\n</g>\n<g transform=\"translate(14217,0)\">\n <use xlink:href=\"#E1-MJMAIN-221A\" x=\"0\" y=\"-109\"></use>\n<rect stroke=\"none\" width=\"577\" height=\"60\" x=\"838\" y=\"641\"></rect>\n <use xlink:href=\"#E1-MJMATHI-78\" x=\"838\" y=\"0\"></use>\n</g>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -2.338ex; width:36.307ex; height:5.676ex;",
                    "log": "success",
                }
            }
        }, {
            query: {
                type: "mml",
                q: "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"upper E equals m c squared\">\n  <mi>E</mi>\n  <mo>=</mo>\n  <mi>m</mi>\n  <msup>\n    <mi>c</mi>\n    <mrow class=\"MJX-TeXAtom-ORD\">\n      <mn>2</mn>\n    </mrow>\n  </msup>\n</math>"
            },
            response: {
                status: 200,
                body: {
                    "mathoidStyle": "vertical-align: -0.338ex; width:9.025ex; height:2.676ex;",
                    "log": "success",
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"upper E equals m c squared\">\n  <mi>E</mi>\n  <mo>=</mo>\n  <mi>m</mi>\n  <msup>\n    <mi>c</mi>\n    <mrow class=\"MJX-TeXAtom-ORD\">\n      <mn>2</mn>\n    </mrow>\n  </msup>\n</math>",
                    "speech": "upper E equals m c squared",
                    "success": true,
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"9.025ex\" height=\"2.676ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -1006.6 3885.6 1152.1\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">upper E equals m c squared</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-45\" d=\"M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-3D\" d=\"M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-6D\" d=\"M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-63\" d=\"M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMATHI-45\" x=\"0\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMAIN-3D\" x=\"1046\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMATHI-6D\" x=\"2107\" y=\"0\"></use>\n<g transform=\"translate(2990,0)\">\n <use xlink:href=\"#E1-MJMATHI-63\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"619\" y=\"583\"></use>\n</g>\n</g>\n</svg>",
                }
            }
        },
        {
            query: {
                q: "{\\overline {A}}^{T}"
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"upper A overbar Superscript upper T\">\n  <semantics>\n    <msup>\n      <mrow class=\"MJX-TeXAtom-ORD\">\n        <mover>\n          <mi>A</mi>\n          <mo accent=\"false\">&#x00AF;<!-- ¯ --></mo>\n        </mover>\n      </mrow>\n      <mrow class=\"MJX-TeXAtom-ORD\">\n        <mi>T</mi>\n      </mrow>\n    </msup>\n    <annotation encoding=\"application/x-tex\">{\\overline {A}}^{T}</annotation>\n  </semantics>\n</math>",
                    "speech": "upper A overbar Superscript upper T",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"3.265ex\" height=\"3.509ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -1365.4 1405.8 1510.9\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">upper A overbar Superscript upper T</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-41\" d=\"M208 74Q208 50 254 46Q272 46 272 35Q272 34 270 22Q267 8 264 4T251 0Q249 0 239 0T205 1T141 2Q70 2 50 0H42Q35 7 35 11Q37 38 48 46H62Q132 49 164 96Q170 102 345 401T523 704Q530 716 547 716H555H572Q578 707 578 706L606 383Q634 60 636 57Q641 46 701 46Q726 46 726 36Q726 34 723 22Q720 7 718 4T704 0Q701 0 690 0T651 1T578 2Q484 2 455 0H443Q437 6 437 9T439 27Q443 40 445 43L449 46H469Q523 49 533 63L521 213H283L249 155Q208 86 208 74ZM516 260Q516 271 504 416T490 562L463 519Q447 492 400 412L310 260L413 259Q516 259 516 260Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-AF\" d=\"M69 544V590H430V544H69Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-54\" d=\"M40 437Q21 437 21 445Q21 450 37 501T71 602L88 651Q93 669 101 677H569H659Q691 677 697 676T704 667Q704 661 687 553T668 444Q668 437 649 437Q640 437 637 437T631 442L629 445Q629 451 635 490T641 551Q641 586 628 604T573 629Q568 630 515 631Q469 631 457 630T439 622Q438 621 368 343T298 60Q298 48 386 46Q418 46 427 45T436 36Q436 31 433 22Q429 4 424 1L422 0Q419 0 415 0Q410 0 363 1T228 2Q99 2 64 0H49Q43 6 43 9T45 27Q49 40 55 46H83H94Q174 46 189 55Q190 56 191 56Q196 59 201 76T241 233Q258 301 269 344Q339 619 339 625Q339 630 310 630H279Q212 630 191 624Q146 614 121 583T67 467Q60 445 57 441T43 437H40Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMATHI-41\" x=\"24\" y=\"0\"></use>\n<g transform=\"translate(0,548)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-AF\" x=\"-74\" y=\"0\"></use>\n<g transform=\"translate(205.15280868766467,0) scale(0.9577042647969157,1)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-AF\"></use>\n</g>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-AF\" x=\"632\" y=\"0\"></use>\n</g>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-54\" x=\"1137\" y=\"1130\"></use>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -0.338ex; width:3.265ex; height:3.509ex;",
                    "success": true,
                    "log": "success"
                }
            }
        },
        {
            query: {
                q: "\\sum _{i=0}^{\\infty }i^{-2}=2",
                type: "inline-tex"
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" alttext=\"sigma-summation Underscript i equals 0 Overscript normal infinity Endscripts i Superscript negative 2 Baseline equals 2\">\n  <semantics>\n    <mrow>\n      <munderover>\n        <mo>&#x2211;<!-- ∑ --></mo>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mi>i</mi>\n          <mo>=</mo>\n          <mn>0</mn>\n        </mrow>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mi mathvariant=\"normal\">&#x221E;<!-- ∞ --></mi>\n        </mrow>\n      </munderover>\n      <msup>\n        <mi>i</mi>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mo>&#x2212;<!-- − --></mo>\n          <mn>2</mn>\n        </mrow>\n      </msup>\n      <mo>=</mo>\n      <mn>2</mn>\n    </mrow>\n    <annotation encoding=\"application/x-tex\">\\sum _{i=0}^{\\infty }i^{-2}=2</annotation>\n  </semantics>\n</math>",
                    "speech": "sigma-summation Underscript i equals 0 Overscript normal infinity Endscripts i Superscript negative 2 Baseline equals 2",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"13.216ex\" height=\"3.176ex\" style=\"vertical-align: -1.005ex;\" viewBox=\"0 -934.9 5690.2 1367.4\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">sigma-summation Underscript i equals 0 Overscript normal infinity Endscripts i Superscript negative 2 Baseline equals 2</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJSZ1-2211\" d=\"M61 748Q64 750 489 750H913L954 640Q965 609 976 579T993 533T999 516H979L959 517Q936 579 886 621T777 682Q724 700 655 705T436 710H319Q183 710 183 709Q186 706 348 484T511 259Q517 250 513 244L490 216Q466 188 420 134T330 27L149 -187Q149 -188 362 -188Q388 -188 436 -188T506 -189Q679 -189 778 -162T936 -43Q946 -27 959 6H999L913 -249L489 -250Q65 -250 62 -248Q56 -246 56 -239Q56 -234 118 -161Q186 -81 245 -11L428 206Q428 207 242 462L57 717L56 728Q56 744 61 748Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-221E\" d=\"M55 217Q55 305 111 373T254 442Q342 442 419 381Q457 350 493 303L507 284L514 294Q618 442 747 442Q833 442 888 374T944 214Q944 128 889 59T743 -11Q657 -11 580 50Q542 81 506 128L492 147L485 137Q381 -11 252 -11Q166 -11 111 57T55 217ZM907 217Q907 285 869 341T761 397Q740 397 720 392T682 378T648 359T619 335T594 310T574 285T559 263T548 246L543 238L574 198Q605 158 622 138T664 94T714 61T765 51Q827 51 867 100T907 217ZM92 214Q92 145 131 89T239 33Q357 33 456 193L425 233Q364 312 334 337Q285 380 233 380Q171 380 132 331T92 214Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-69\" d=\"M184 600Q184 624 203 642T247 661Q265 661 277 649T290 619Q290 596 270 577T226 557Q211 557 198 567T184 600ZM21 287Q21 295 30 318T54 369T98 420T158 442Q197 442 223 419T250 357Q250 340 236 301T196 196T154 83Q149 61 149 51Q149 26 166 26Q175 26 185 29T208 43T235 78T260 137Q263 149 265 151T282 153Q302 153 302 143Q302 135 293 112T268 61T223 11T161 -11Q129 -11 102 10T74 74Q74 91 79 106T122 220Q160 321 166 341T173 380Q173 404 156 404H154Q124 404 99 371T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-3D\" d=\"M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-30\" d=\"M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-2212\" d=\"M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJSZ1-2211\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-221E\" x=\"1500\" y=\"688\"></use>\n<g transform=\"translate(1061,-296)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-69\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-3D\" x=\"350\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-30\" x=\"1133\" y=\"0\"></use>\n</g>\n<g transform=\"translate(2485,0)\">\n <use xlink:href=\"#E1-MJMATHI-69\" x=\"0\" y=\"0\"></use>\n<g transform=\"translate(350,362)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-2212\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"783\" y=\"0\"></use>\n</g>\n</g>\n <use xlink:href=\"#E1-MJMAIN-3D\" x=\"4124\" y=\"0\"></use>\n <use xlink:href=\"#E1-MJMAIN-32\" x=\"5185\" y=\"0\"></use>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -1.005ex; width:13.216ex; height:3.176ex;",
                    "success": true,
                    "log": "success",
                }
            }
        }, {
            query: {
                q: "\\pagecolor {Gray}x^{2}" //T107578
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"x squared\">\n  <semantics>\n    <msup>\n      <mi>x</mi>\n      <mrow class=\"MJX-TeXAtom-ORD\">\n        <mn>2</mn>\n      </mrow>\n    </msup>\n    <annotation encoding=\"application/x-tex\">\\pagecolor {Gray}x^{2}</annotation>\n  </semantics>\n</math>",
                    "speech": "x squared",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"2.402ex\" height=\"2.676ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -1006.6 1034.1 1152.1\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">x squared</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-78\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMATHI-78\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"816\" y=\"583\"></use>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -0.338ex; width:2.402ex; height:2.676ex;",
                    "success": true,
                    "log": "success"
                }
            }
        }, {
            query: {
                q: "\\definecolor {myorange}{rgb}{1,0.6470588235294118,0.39215686274509803}\\color {myorange}e^{i\\pi }\\color {Black}=-1" //T107765
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\" alttext=\"e Superscript i pi Baseline equals negative 1\">\n  <semantics>\n    <mstyle mathcolor=\"#ffa564\">\n      <msup>\n        <mi>e</mi>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mi>i</mi>\n          <mi>&#x03C0;<!-- π --></mi>\n        </mrow>\n      </msup>\n      <mstyle mathcolor=\"#221E1F\">\n        <mo>=</mo>\n        <mo>&#x2212;<!-- − --></mo>\n        <mn>1</mn>\n      </mstyle>\n    </mstyle>\n    <annotation encoding=\"application/x-tex\">\\definecolor {myorange}{rgb}{1,0.6470588235294118,0.39215686274509803}\\color {myorange}e^{i\\pi }\\color {Black}=-1</annotation>\n  </semantics>\n</math>",
                    "speech": "e Superscript i pi Baseline equals negative 1",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"8.951ex\" height=\"2.676ex\" style=\"vertical-align: -0.338ex;\" viewBox=\"0 -1006.6 3853.8 1152.1\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">e Superscript i pi Baseline equals negative 1</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMATHI-65\" d=\"M39 168Q39 225 58 272T107 350T174 402T244 433T307 442H310Q355 442 388 420T421 355Q421 265 310 237Q261 224 176 223Q139 223 138 221Q138 219 132 186T125 128Q125 81 146 54T209 26T302 45T394 111Q403 121 406 121Q410 121 419 112T429 98T420 82T390 55T344 24T281 -1T205 -11Q126 -11 83 42T39 168ZM373 353Q367 405 305 405Q272 405 244 391T199 357T170 316T154 280T149 261Q149 260 169 260Q282 260 327 284T373 353Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-69\" d=\"M184 600Q184 624 203 642T247 661Q265 661 277 649T290 619Q290 596 270 577T226 557Q211 557 198 567T184 600ZM21 287Q21 295 30 318T54 369T98 420T158 442Q197 442 223 419T250 357Q250 340 236 301T196 196T154 83Q149 61 149 51Q149 26 166 26Q175 26 185 29T208 43T235 78T260 137Q263 149 265 151T282 153Q302 153 302 143Q302 135 293 112T268 61T223 11T161 -11Q129 -11 102 10T74 74Q74 91 79 106T122 220Q160 321 166 341T173 380Q173 404 156 404H154Q124 404 99 371T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMATHI-3C0\" d=\"M132 -11Q98 -11 98 22V33L111 61Q186 219 220 334L228 358H196Q158 358 142 355T103 336Q92 329 81 318T62 297T53 285Q51 284 38 284Q19 284 19 294Q19 300 38 329T93 391T164 429Q171 431 389 431Q549 431 553 430Q573 423 573 402Q573 371 541 360Q535 358 472 358H408L405 341Q393 269 393 222Q393 170 402 129T421 65T431 37Q431 20 417 5T381 -10Q370 -10 363 -7T347 17T331 77Q330 86 330 121Q330 170 339 226T357 318T367 358H269L268 354Q268 351 249 275T206 114T175 17Q164 -11 132 -11Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-3D\" d=\"M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-2212\" d=\"M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-31\" d=\"M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n <use xlink:href=\"#E1-MJMATHI-65\"></use>\n</g>\n<g fill=\"#ffa564\" stroke=\"#ffa564\" transform=\"translate(471,412)\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n<g fill=\"#ffa564\" stroke=\"#ffa564\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-69\"></use>\n</g>\n<g fill=\"#ffa564\" stroke=\"#ffa564\" transform=\"translate(247,0)\">\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMATHI-3C0\"></use>\n</g>\n</g>\n</g>\n</g>\n<g fill=\"#221E1F\" stroke=\"#221E1F\" transform=\"translate(1504,0)\">\n<g fill=\"#221E1F\" stroke=\"#221E1F\">\n<g fill=\"#221E1F\" stroke=\"#221E1F\">\n <use xlink:href=\"#E1-MJMAIN-3D\"></use>\n</g>\n<g fill=\"#221E1F\" stroke=\"#221E1F\" transform=\"translate(1060,0)\">\n <use xlink:href=\"#E1-MJMAIN-2212\"></use>\n</g>\n<g fill=\"#221E1F\" stroke=\"#221E1F\" transform=\"translate(1843,0)\">\n <use xlink:href=\"#E1-MJMAIN-31\"></use>\n</g>\n</g>\n</g>\n</g>\n</g>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -0.338ex; width:8.951ex; height:2.676ex;",
                    "success": true,
                    "log": "success",
                }
            }
        }, {
            query: {
                q: "{\\ce {H2O}}",
                type: "chem"
            },
            response: {
                status: 200,
                body: {
                    "mml": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" alttext=\"upper H Subscript 2 Superscript Baseline upper O\">\n  <semantics>\n    <mrow class=\"MJX-TeXAtom-ORD\">\n      <msubsup>\n        <mtext>H</mtext>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mn>2</mn>\n        </mrow>\n        <mrow class=\"MJX-TeXAtom-ORD\">\n          <mspace width=\"0pt\" height=\"0pt\" depth=\".2em\" />\n        </mrow>\n      </msubsup>\n      <mtext>O</mtext>\n    </mrow>\n    <annotation encoding=\"application/x-tex\">{\\ce {H2O}}</annotation>\n  </semantics>\n</math>",
                    "speakText": "upper H Subscript 2 Superscript Baseline upper O",
                    "svg": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"4.634ex\" height=\"2.843ex\" style=\"vertical-align: -1.005ex;\" viewBox=\"0 -791.3 1995.1 1223.9\" xmlns=\"http://www.w3.org/2000/svg\" role=\"math\" aria-labelledby=\"MathJax-SVG-1-Title MathJax-SVG-1-Desc\">\n<title id=\"MathJax-SVG-1-Title\">Equation</title>\n<desc id=\"MathJax-SVG-1-Desc\">upper H Subscript 2 Superscript Baseline upper O</desc>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"10\" id=\"E1-MJMAIN-48\" d=\"M128 622Q121 629 117 631T101 634T58 637H25V683H36Q57 680 180 680Q315 680 324 683H335V637H302Q262 636 251 634T233 622L232 500V378H517V622Q510 629 506 631T490 634T447 637H414V683H425Q446 680 569 680Q704 680 713 683H724V637H691Q651 636 640 634T622 622V61Q628 51 639 49T691 46H724V0H713Q692 3 569 3Q434 3 425 0H414V46H447Q489 47 498 49T517 61V332H232V197L233 61Q239 51 250 49T302 46H335V0H324Q303 3 180 3Q45 3 36 0H25V46H58Q100 47 109 49T128 61V622Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path>\n<path stroke-width=\"10\" id=\"E1-MJMAIN-4F\" d=\"M56 340Q56 423 86 494T164 610T270 680T388 705Q521 705 621 601T722 341Q722 260 693 191T617 75T510 4T388 -22T267 3T160 74T85 189T56 340ZM467 647Q426 665 388 665Q360 665 331 654T269 620T213 549T179 439Q174 411 174 354Q174 144 277 61Q327 20 385 20H389H391Q474 20 537 99Q603 188 603 354Q603 411 598 439Q577 592 467 647Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-MJMAIN-48\" x=\"0\" y=\"0\"></use>\n <use transform=\"scale(0.707)\" xlink:href=\"#E1-MJMAIN-32\" x=\"1067\" y=\"-444\"></use>\n <use xlink:href=\"#E1-MJMAIN-4F\" x=\"1212\" y=\"0\"></use>\n</g>\n</svg>",
                    "mathoidStyle": "vertical-align: -1.005ex; width:4.634ex; height:2.843ex;",
                    "success": true,
                    "log": "success",
                    "speech": "upper H Subscript 2 Superscript Baseline upper O"
                }
            }
        }
    ]
    ;


describe('Mathoid API tests with no_check option', function () {
    before(function (cb) {
        server.start({no_check:true, png:false});
        // Wait for MathJax startup, as that's somewhat async but has a sync
        // interface
        setTimeout(cb, 1000);
    });

    describe('Standard input / output pairs', function () {
        testData.forEach(function (data) {
            it(data.query.q, function () {
                this.timeout(30000);
                return preq.post({
                    uri: baseURL,
                    body: data.query
                }).then(function (res) {
                    assert.status(res, data.response.status);
                    Object.keys(data.response.body).forEach(function (key) {
                        if (key === 'png') {
                            assert.notDeepEqual(res.body.png, undefined);
                            assert.notDeepEqual(res.body.png.length, 0);
                        } else {
                            assert.deepEqual(res.body[key], data.response.body[key]);
                        }
                    });
                });
            });
        });
    });
    describe('annotation security', function () {
        it("annotation xml should be properly escaped", function () {
            this.timeout(4000);
            return preq.post({
                uri: baseURL,
                body: {
                    q: "\\mathrm{</annotation-xml><script>alert('test');</script>}",
                    nospeech: true
                }
            }).then(function (res) {
                assert.status(res, 200);
                assert.deepEqual(res.body.mml, "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">\n  <semantics>\n    <mrow class=\"MJX-TeXAtom-ORD\">\n      <mo>&lt;</mo>\n      <mrow class=\"MJX-TeXAtom-ORD\">\n        <mo>/</mo>\n      </mrow>\n      <mi mathvariant=\"normal\">a</mi>\n      <mi mathvariant=\"normal\">n</mi>\n      <mi mathvariant=\"normal\">n</mi>\n      <mi mathvariant=\"normal\">o</mi>\n      <mi mathvariant=\"normal\">t</mi>\n      <mi mathvariant=\"normal\">a</mi>\n      <mi mathvariant=\"normal\">t</mi>\n      <mi mathvariant=\"normal\">i</mi>\n      <mi mathvariant=\"normal\">o</mi>\n      <mi mathvariant=\"normal\">n</mi>\n      <mo>&#x2212;<!-- − --></mo>\n      <mi mathvariant=\"normal\">x</mi>\n      <mi mathvariant=\"normal\">m</mi>\n      <mi mathvariant=\"normal\">l</mi>\n      <mo>&gt;&lt;</mo>\n      <mi mathvariant=\"normal\">s</mi>\n      <mi mathvariant=\"normal\">c</mi>\n      <mi mathvariant=\"normal\">r</mi>\n      <mi mathvariant=\"normal\">i</mi>\n      <mi mathvariant=\"normal\">p</mi>\n      <mi mathvariant=\"normal\">t</mi>\n      <mo>&gt;</mo>\n      <mi mathvariant=\"normal\">a</mi>\n      <mi mathvariant=\"normal\">l</mi>\n      <mi mathvariant=\"normal\">e</mi>\n      <mi mathvariant=\"normal\">r</mi>\n      <mi mathvariant=\"normal\">t</mi>\n      <msup>\n        <mo stretchy=\"false\">(</mo>\n        <mo>&#x2032;</mo>\n      </msup>\n      <mi mathvariant=\"normal\">t</mi>\n      <mi mathvariant=\"normal\">e</mi>\n      <mi mathvariant=\"normal\">s</mi>\n      <msup>\n        <mi mathvariant=\"normal\">t</mi>\n        <mo>&#x2032;</mo>\n      </msup>\n      <mo stretchy=\"false\">)</mo>\n      <mo>;</mo>\n      <mo>&lt;</mo>\n      <mrow class=\"MJX-TeXAtom-ORD\">\n        <mo>/</mo>\n      </mrow>\n      <mi mathvariant=\"normal\">s</mi>\n      <mi mathvariant=\"normal\">c</mi>\n      <mi mathvariant=\"normal\">r</mi>\n      <mi mathvariant=\"normal\">i</mi>\n      <mi mathvariant=\"normal\">p</mi>\n      <mi mathvariant=\"normal\">t</mi>\n      <mo>&gt;</mo>\n    </mrow>\n    <annotation encoding=\"application/x-tex\">\\mathrm{&lt;/annotation-xml&gt;&lt;script&gt;alert('test');&lt;/script&gt;}</annotation>\n  </semantics>\n</math>");
            });
        });
    });
    describe('query parameter', function () {
        it("missing q parameter should return 400", function () {
            return preq.post({
                uri: baseURL,
                body: {}
            }).then(function (res) {
                // if we are here, no error was thrown, not good
                throw new Error('Expected an error to be thrown, got status: ' + res.status);
            }, function (res) {
                assert.status(res, 400);
                assert.deepEqual(res.body.error, "q (query) post parameter is missing!");
            });
        });
        it("reject invalid input type", function () {
            return preq.post({
                uri: baseURL,
                body: {q: "E=mc^2}", type: "invalid"}
            }).then(function (res) {
                // if we are here, no error was thrown, not good
                throw new Error('Expected an error to be thrown, got status: ' + res.status);
            }, function (res) {
                assert.status(res, 400);
                assert.deepEqual(res.body.success, false);
                assert.deepEqual(res.body.detail, "Input format \"invalid\" is not recognized!");
            });
        });
        it("display texvcinfo", function () {
            return preq.post({
                uri: baseURL + "texvcinfo",
                body: {q: "\\mathcal{S}"}
            }).then(function (res) {
                assert.status(res, 200);
                assert.ok(res.body.identifiers.indexOf("\\mathcal{S}") === 0);
            });
        });
        it("display graph", function () {
            return preq.post({
                uri: baseURL + "graph",
                body: {q: "\\frac{a}{b}"}
            }).then(function (res) {
                assert.status(res, 200);
                assert.notDeepEqual(res.body.name === 'root');
            });
        });
        it("get speech text", function () {
            return preq.post({
                uri: baseURL + "speech",
                body: {q: "E=mc^2"}
            }).then(function (res) {
                assert.status(res, 200);
                assert.deepEqual(res.body, "upper E equals m c squared");
            });
        });
        it("get svg dimensions in mathml headers", function () {
            return preq.post({
                uri: baseURL + "mml",
                body: {q: "E=mc^2"}
            }).then(function (res) {
                assert.status(res, 200);
                assert.deepEqual(res.headers['x-mathoid-style'], 'vertical-align: -0.338ex; width:9.025ex; height:2.676ex;');
            });
        });
    });

});

