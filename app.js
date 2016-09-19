'use strict';
const welcome = [
    '#######   ########   ##   ##         #     #             #        #         #',
    '#         #      #     # #          # #   # #           # #       # #       #',
    '#######   #      #      #          #   # #   #         #   #      #   #     #',
    '#         #      #     # #        #     #     #       # # # #     #     #   #',
    '#         #      #    #   #      #             #     #       #    #       # #',
    '#         ########   #     #    #               #   #         #   #         #'
].join('\n');

global.__rootdir = __dirname;
module.exports = require('./dist/index.js');