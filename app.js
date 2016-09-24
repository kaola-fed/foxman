'use strict';
const welcome = [
    '#######   ########   ##   ##         #     #             #        #         #',
    '#         #      #     # #          # #   # #           # #       # #       #',
    '#######   #      #      #          #   # #   #         #   #      #   #     #',
    '#         #      #     # #        #     #     #       # # # #     #     #   #',
    '#         #      #    #   #      #             #     #       #    #       # #',
    '#         ########   #     #    #               #   #         #   #         #'
].join('\n');
console.log(welcome);
require('babel-polyfill');
module.exports = require('./dist/index.js');