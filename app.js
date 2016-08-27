'use strict';
global.__rootdir = __dirname;
module.exports = function (config) {
	if( process.env.NODE_ENV === "development" ){
		// require('./src/server.js')(config);
		require("babel-register");
		require('babel-polyfill');
		require('./src/init/index.js')(config);
	} else {
		require('./dist/server.js')(config);
	}
};