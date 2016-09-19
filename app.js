'use strict';
const welcome = [
    '#######   ########   ##   ##         #     #             #        #         #',
    '#         #      #     # #          # #   # #           # #       # #       #',
    '#######   #      #      #          #   # #   #         #   #      #   #     #',
    '#         #      #     # #        #     #     #       # # # #     #     #   #',
    '#         #      #    #   #      #             #     #       #    #       # #',
    '#         ########   #     #    #               #   #         #   #         #'
].join('\n');
console.log( welcome );

global.__rootdir = __dirname;
module.exports = require('./dist/index.js');

