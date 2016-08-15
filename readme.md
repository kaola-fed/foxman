# foxman

[![NPM version][npm-image]][npm-url] 
[![NPM version][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

# Introduction

a flexiable mock data server 4 front-end engineer. 

# Installation

1. global install:
`npm install -g foxman`

2. create config file（default is './foxman.config.js'）:
	```javascript 
	var path = require('path');

    module.exports = {
      port: '3000',
      path: {
        root: path.join(__dirname, 'ftl'),
        syncData: path.join(__dirname, 'mock', 'fakeData'),
        asyncData: path.join(__dirname, 'mock', 'json'),
        static: [
          path.join(__dirname, 'static')
        ]
      }
    };
	```
3. foxman


[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: http://badge.fury.io/js/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
