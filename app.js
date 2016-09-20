'use strict';
const welcome = [
    '#######   ########   ##   ##         #     #             #        #         #',
    '#         #      #     # #          # #   # #           # #       # #       #',
    '#######   #      #      #          #   # #   #         #   #      #   #     #',
    '#         #      #     # #        #     #     #       # # # #     #     #   #',
    '#         #      #    #   #      #             #     #       #    #       # #',
    '#         ########   #     #    #               #   #         #   #         #'
].join('\n');
require('babel-polyfill');
module.exports = require('./dist/index.js');