'use strict';
const path = require('path');
const webpackConfig = require('./webpack.config');

const Mcss = require('foxman-processor-mcss');
const AutoPrefixer = require('foxman-processor-autoprefixer');
const RouteDisplay = require('foxman-plugin-route-display');
const MockControl = require('foxman-plugin-mock-control');
const Automount = require('foxman-plugin-automount');
const WebpackDevServer = require('foxman-plugin-webpack-dev-server');

const paths = {
    webapp: __dirname
};

Object.assign(paths, {
    viewRoot: path.join(paths.webapp, 'template'),
    syncData: path.join(paths.webapp, 'mock', 'sync'),
    asyncData: path.join(paths.webapp, 'mock', 'async')
});

Object.assign(paths, {
    commonTpl: path.join(paths.webapp, 'commonTpl')
});

Object.assign(paths, {
    src: path.join(__dirname, 'src')
});

module.exports = {
    upgrade: {
        version: '0.8.2'
    },
    plugins: [
        // new RouteDisplay(),
        //
        // new MockControl({
        //     /**
        //      * 在 mock json 的同目录下找，文件名一样 的 .js 文件, 默认如下
        //      * @param dataPath
        //      * @returns {string|*|XML|void}
        //      */
        //     mapJS: function (dataPath) {
        //         return dataPath.replace(/\.json$/, '.js');
        //     }
        // }),
        //
        // new Automount({
        //     tplUrlMap: {
        //         '/index.html': 'foo.bar'
        //     }
        // }),
        //
        // new WebpackDevServer({
        //     webpackConfig,
        //     devServerConfig:{
        //         quiet: true,
        //         noInfo: true,
        //         lazy: false
        //     }
        // })
    ],

    processors: [
        {
            match: '/src/css/:css.css',
            pipeline: [
                new Mcss({
                    paths: []
                }),
                new AutoPrefixer({
                    cascade: false,
                    browsers: '> 5%'
                })
            ],
            locate(reqPath){
                return path.join(__dirname + reqPath.replace(/css/g, 'mcss'));
            }
        }
    ],


    proxy: [
        { name: 'pre', host: '', ip: '', protocol: 'http'}
    ],

    routes: [
        {
            method: 'GET',
            url: '/ajax/index.html',
            sync: false,
            filePath: 'foo.bar'
        },
        {
            method: 'GET',
            url: '/fooBar.html',
            sync: true,
            filePath: 'foo.bar'
        }
    ],

    port: 9000,
    secure: false,
    engineConfig: {
        paths: [paths.commonTpl]
    },
    extension: 'ftl',
    viewRoot: paths.viewRoot,
    syncData: paths.syncData,
    asyncData: paths.asyncData,
    statics: []
};
