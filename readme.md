# foxman

[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

> flexiable mock server for frontend engineer

# Installation

```bash
$ npm install foxman -g
```
# Preview
![http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/A476DE54F65648458ADAEA221AA07046/6041](http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/A476DE54F65648458ADAEA221AA07046/6041)

# Usage

**Step 1**: create config file in your project folder, if not specified, `foxman.config.js` will be used

```js
'use strict';
const path = require('path');

const mcss = require('../../foxman-mcss');
const autoprefix = require('gulp-autoprefixer');

const reloadPlugin = require('./plugin.reload');

const root = path.resolve(__dirname, 'src', 'main', 'webapp');

/**
 * a route table to query tpl and model
 * @type {Array}
 */
const router = [
  {
    method: 'GET', url: '/index.html', sync: false, filePath: 'index.ftl',
    method: 'GET', url: '/index2.html', sync: false, filePath: 'index2.ftl'
  }
]

module.exports = {
    root,
    plugins: [
        new reloadPlugin({
            name: 'xujunyu'
        })
    ],
    preCompilers: [{
        /*  [1] relative to root
         ** [2] abs path is started with /
         */
        test: 'src/mcss/**/*.mcss', // String or ArrayList<String>
        handler: (dest) => [
            mcss(),
            autoprefix({
                browsers: ['Android >= 2.3'],
                cascade: false
            }),
            dest('src/css/')
        ]
    }],
    watch: {
        /**
         * absolute
         * @type {[type]}
         */
    },
    server: {
        port: 3000,
        router,
        proxy: false,
        tpl: {
          suffix: 'ftl',
          /**
           * combime
           * @param  {[type]} tpl  [description]
           * @param  {[type]} data [description]
           * @return {[type]}      [description]
           */
          handler: null /**  parse Util Class default is ftl render **/
        },
        dataMatch: ( syncFilePath ) => path.resolve( this.syncData, syncFilePath + '.json' ),
        viewRoot: path.resolve( root, 'WEB-INF' ),
        syncData: path.resolve( __dirname, 'mock', 'fakeData' ),
        asyncData: path.resolve( __dirname, 'mock', 'json' ),
        static: [
            path.resolve(__dirname, 'static')
        ]
    }
};

```

**Step 2**: run `foxman`

```bash
$ foxman
```

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
