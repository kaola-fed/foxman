'use strict';
global.__rootdir = __dirname;


module.exports = (config) => {
	if( process.env.NODE_ENV === "development" ){
		// require('./src/server.js')(config);
		require("babel-register");
		require('babel-polyfill');
		require('./src/index.js')(config);
		
	} else {
		require('./dist/server.js')(config);
	}
};