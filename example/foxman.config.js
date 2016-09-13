'use strict';
const path = require('path');

const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');

const routers = [];

const root = path.resolve(__dirname, 'src', 'main', 'webapp');

module.exports = {
    root,
    plugins: [
    ],
    nei: {
      config: 'nei.xxxx.xxxxxxxxxxxxxxxx/server.config.js',
      mockTpl: 'backend/template/mock',
      mockApi: 'backend/src/mock'
    },
    preCompilers: [{
        test: ['src/mcss/**/*.mcss'],
        exclude: ['1.mcss','2.mcss'],
        handler: (dest) => [
            mcss({
                "include": [ path.resolve(root,"src/javascript/kaola-fed-lib/components/h5"),
                             path.resolve(root,"src/javascript/pages/h5/components")],
                "exclude": "(\\\\|\\/)_",
                "format": 1
            }),
            autoprefix({
                browsers: ['Android >= 2.3'],
                cascade: false
            }),
            dest('src/css')
        ]
    }],
    watch: {
        /**
         * absolute
         * @type {[type]}
         */
    },
    tplConfig: {
      extension: 'ftl',
      // TODO: 外部的渲染工具
      renderUtil: null /**  parse Util Class default is ftl render **/
    },
    server: {
      routers,
      port: 3000,
      proxy: {
        test1: 'http://10.240.178.181:90'
      },
      syncData: 'mock/fakeData',
      viewRoot: 'WEB-INF/template',
      asyncData: 'mock/json',
      static: [ 'src' ]
    }
};
