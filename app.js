'use strict';
global.__rootdirname = __dirname;
require('babel-polyfill');

module.exports = function (config) {
	require('./dist/server.js')(config);
}