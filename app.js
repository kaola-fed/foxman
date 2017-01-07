'use strict';
require('babel-polyfill');
console.log([
	' _____   _____  __    __      ___  ___       ___   __   _',  
	'|  ___| /  _  \\ \\ \\  / /     /   |/   |     /   | |  \\ | | ',
	'| |__   | | | |  \\ \\/ /     / /|   /| |    / /| | |   \\| |' ,
	'|  __|  | | | |   }  {     / / |__/ | |   / / | | | |\\   |' ,
	'| |     | |_| |  / /\\ \\   / /       | |  / /  | | | | \\  |',
	'|_|     \\_____/ /_/  \\_\\ /_/        |_| /_/   |_| |_|  \\_|' ,
].join('\n'));
console.time('start')
module.exports = (process.env.NODE_ENV === 'development')? require('./src/index.js'): require('./dist/index.js');
console.timeEnd('start')
