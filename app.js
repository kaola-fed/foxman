'use strict';
global.__rootdir = __dirname;
require('babel-polyfill');

module.exports = function (config) {
	require('./dist/server.js')(config);
};