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
	'use strict';
	var path = require('path');
	var PluginA = require('./plugin.test');
	var mcss = require('./foxman-mcss');
	var autoprefix = require('gulp-autoprefixer');
	var root = path.join(__dirname,'src','main','webapp');
	module.exports = {
	 root,
	 plugins: [
	 	[PluginA, {name:'xujunyu'}]
	 ],
	 preCompilers:[{
	    /* [1] relative to root
	    ** [2] abs path is started with /
	    */
	     test: 'src/mcss/**/*.mcss', // String or ArrayList<String>
	     precompiler: (dest) => [
	       mcss(),
	       autoprefix({browsers: [ 'Android >= 2.3'], cascade: false}),
	       dest('src/css/')
	     ]
	   }
	 ],
	 watch:{
	   /**
	    * absolute
	    * @type {[type]}
	    */
	 },
	  server: {
	    port:      3000,
	    viewRoot:  path.resolve(root, 'WEB-INF'),
	    syncData:  path.resolve(__dirname, 'mock', 'fakeData'),
	    asyncData: path.resolve(__dirname, 'mock', 'json'),
	    static: [
	     path.resolve(__dirname, 'static')
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
