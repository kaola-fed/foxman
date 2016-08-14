global.__rootdirname = __dirname;
require('babel-polyfill');

module.exports = function (config) {
	console.log(require('./dist/server.js'));
	require('./dist/server.js')(config);
}