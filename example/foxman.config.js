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
const syncData = path.resolve( __dirname, 'mock', 'fakeData' );

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
          // suffix: 'ftl',
          // /**
          //  * combime
          //  * @param  {[type]} tpl  [description]
          //  * @param  {[type]} data [description]
          //  * @return {[type]}      [description]
          //  */
          // renderUtil: null /**  parse Util Class default is ftl render **/
        },
        dataMatch: ( syncFilePath ) => path.resolve( syncData , syncFilePath + '.json' ),
        viewRoot: path.resolve( root, 'WEB-INF' ),
        syncData,
        asyncData: path.resolve( __dirname, 'mock', 'json' ),
        static: [
            path.resolve(__dirname, 'static')
        ]
    }
};
