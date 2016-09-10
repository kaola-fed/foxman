'use strict';
const path = require('path');

const mcss = require('../../foxman-mcss');
const autoprefix = require('gulp-autoprefixer');

// const NeiPlugin = require('./plugin.nei');

const router = require('./route');

const root = path.resolve(__dirname, 'src', 'main', 'webapp');

module.exports = {
    root,
    plugins: [
        // new NeiPlugin({
        //     name: 'xujunyu'
        // })
    ],
    preCompilers: [{
        test: path.resolve(root, 'src/mcss/**/*.mcss'), // String or ArrayList<String>
        handler: (dest) => [
            mcss(),
            autoprefix({
                browsers: ['Android >= 2.3'],
                cascade: false
            }),
            dest( path.resolve(root, 'src/css/') )
        ]
    }],
    watch: {
        /**
         * absolute
         * @type {[type]}
         */
    },
    server: {
      router,
      port: 3000,
      proxy: [
        {
          test1: {

          }
        }
      ],
      tplConfig: {
        extension: 'ftl',
        // TODO: 外部的渲染工具
        renderUtil: null /**  parse Util Class default is ftl render **/
      },
      dataMatch: ( syncFilePath ) => path.resolve( __dirname, 'mock', 'fakeData', syncFilePath + '.json' ) , // 默认是层级
      syncData: path.resolve( __dirname, 'mock', 'fakeData' ),
      viewRoot: path.resolve( root, 'WEB-INF' ),
      asyncData: path.resolve( __dirname, 'mock', 'json' ),
      static: [
          path.resolve(root, 'src')
      ]
    }
};
