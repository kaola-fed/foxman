'use strict';
const path = require('path');

const mcss = require('../../foxman-mcss');
const autoprefix = require('gulp-autoprefixer');

const reloadPlugin = require('./plugin.reload');

const root = path.resolve(__dirname, 'src', 'main', 'webapp');

const router = [
  'get', '/index.html', 'index.ftl'
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
        dataMatch:( syncFilePath ) => path.resolve( this.syncData, syncFilePath + '.json' ),
        viewRoot: path.resolve( root, 'WEB-INF' ),
        syncData: path.resolve( __dirname, 'mock', 'fakeData' ),
        asyncData: path.resolve( __dirname, 'mock', 'json' ),
        static: [
            path.resolve(__dirname, 'static')
        ]
    }
};
