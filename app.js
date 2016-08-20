'use strict';
global.__rootdir = __dirname;
require("babel-register");
require('babel-polyfill');
module.exports = function (config) {
	if( process.env.NODE_ENV === "development" ){
		require('./src/server.js')(config);
	} else {
		require('./dist/server.js')(config);
	}
};