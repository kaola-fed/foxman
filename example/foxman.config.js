const path = require('path');
const Mcss = require('@foxman/processor-mcss');
const AutoPrefixer = require('@foxman/processor-autoprefixer');
const RouteDisplay = require('@foxman/plugin-route-display');
const MockControl = require('@foxman/plugin-mock-control');
const Automount = require('@foxman/plugin-automount');
const WebpackDevServer = require('@foxman/plugin-webpack-dev-server');
const PublicMock = require('@foxman/plugin-public-mock');

const Engine = require('./foxman.config.engine');
const webpackConfig = require('./webpack.config');
const PATHES = require('./foxman.config.pathes');

module.exports = {
    upgrade: {
        version: '0.8.2'
    },
    plugins: [
        new RouteDisplay(),
        
        new MockControl({
            /**
             * 在 mock json 的同目录下找，文件名一样 的 .js 文件, 【默认如下】
             * @param dataPath
             * @returns {string|*|XML|void}
             */
            mapJS: function (dataPath) {
                return dataPath.replace(/\.json$/, '.js');
            }
        }),
        
        new Automount({
            tplUrlMap: {
                '/user/ajax/getUserProfile.html': 'getUserProfile'
            }
        }),
        
        new WebpackDevServer({
            webpackConfig,
            devServerConfig:{
                quiet: true,
                noInfo: true,
                lazy: false
            }
        }),

        new PublicMock({
            publicMockList: [
                {
                    type: 'sync', // sync（同步） | async（异步） | 缺省（所有请求）
                    pattern: '*',
                    data: {
                        foo: 'bar'
                    }
                }
            ]
        })
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
        { name: 'online', host: 'm.kaola.com', ip: 'm.kaola.com', protocol: 'http'}
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
    engine: Engine,
    engineConfig: {
        paths: [PATHES.commonTpl]
    },
    extension: 'ftl',
    viewRoot: PATHES.viewRoot,
    syncData: PATHES.syncData,
    asyncData: PATHES.asyncData,
    statics: []
};
