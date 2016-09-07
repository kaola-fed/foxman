'use strict';
require('babel-polyfill');

global.__rootdir = __dirname;

module.exports = require('./dist/index.js');