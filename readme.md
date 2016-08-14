# foxman

[![NPM version][npm-image]][npm-url] 

[![NPM][nodei-image]][nodei-url]

# Introduction

a flexiable mock data server 4 front-end engineer. 

# Installation

1. global install:
`npm install -g foxman`

2. create config file:
	```javascript 
	var pathJoin = require('path').join;

	module.exports = {
	  port        : '9999',
	  ftlDir      : pathJoin(__dirname, 'ftl'),             // FTL根目录
	  mockFtlDir  : pathJoin(__dirname, 'mock', 'fakeData'),// FTL combine data 根目录
	  mockJsonDir : pathJoin(__dirname, 'mock', 'json'),    // ajax api 目录
	  static      : {
	    parentDir  : __dirname,                             // 静态资源父级目录
	    dirname    : 'static'                               // 静态资源目录名
	  }
	}
	```
3. foxman --config ./config.js


[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: http://badge.fury.io/js/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
