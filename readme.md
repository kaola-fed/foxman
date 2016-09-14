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
![http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/AB403D840B894D03980520552B3EF39A/6045](http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/AB403D840B894D03980520552B3EF39A/6045)

# Usage

**Step 1**: create config file in your project folder, if not specified, `foxman.config.js` will be used

```js
'use strict';
'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const root = path.resolve(__dirname, 'src', 'main', 'webapp');
const routers = [{
  method: 'GET', url: '/index.html', sync: true, filePath: 'pages/h5/info/detail'
},{
  method: 'GET', url: '/index2.html', sync: false, filePath: 'index'
}];

module.exports = {
    root,
    plugins: [
    ],
    /**nei:{
      config:"",
      mockTpl:"",
      mockApi:""
    }**/
    preCompilers: [{
        test: ['src/mcss/**/*.mcss'],
        /** exclude: ['src\/mcss\/_config.mcss],**/
        handler: (dest) => [
            mcss({
                // "include": [],
                // "exclude": "(\\\\|\\/)_",
                "format": 1
            }),
            autoprefix({
                browsers: ['Android >= 2.3'],
                cascade: false
            }),
            dest('src/css')
        ]
    }],
    watch: {},
    server: {
      routers,
      port: 3000,
      tpl: {
        extension: 'ftl',
        /** renderUtil: null **/
      },
      proxy: {
        test1: ( url ) => {
          let devMark = 'isDev=1000';
          let result = (-1===url.indexOf('?')?`?${devMark}`:`&${devMark}`);
          return 'http://10.240.178.181:90/' + url.replace(/^\//,'') + result;
        }
      },
      syncData: path.resolve(__dirname,'mock/fakeData'),
      viewRoot: 'WEB-INF',
      asyncData: path.resolve(__dirname,'mock/json'),
      static: [ 'src' ]
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
