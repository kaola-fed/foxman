'use strict';
global.__rootdir = __dirname;


module.exports = (config) => {
	(process.env.NODE_ENV === "development")? require('./src/index.js')(config) : require('./dist/server.js')(config);
};
