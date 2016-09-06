'use strict';
const path = require('path');
const PluginA = require('./plugin.test');
const mcss = require('./foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const root = path.join(__dirname, 'src', 'main', 'webapp');
module.exports = {
    root,
    plugins: [
        new PluginA({
            name: 'xujunyu'
        })
    ],
    preCompilers: [{
        /*  [1] relative to root
         ** [2] abs path is started with /
         */
        test: 'src/mcss/**/*.mcss', // String or ArrayList<String>
        precompiler: (dest) => [
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
        viewRoot: path.resolve(root, 'WEB-INF'),
        syncData: path.resolve(__dirname, 'mock', 'fakeData'),
        asyncData: path.resolve(__dirname, 'mock', 'json'),
        static: [
            path.resolve(__dirname, 'static')
        ]
    }
};
