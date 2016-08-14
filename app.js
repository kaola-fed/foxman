require('babel-polyfill');

global.__rootdirname = __dirname;
require('./dist/server.js');
