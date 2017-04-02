'use strict';
const path = require('path');
const routers = require('./route');
const webpackConfig = require('./webpack.config');

// const mcss = require('foxman-mcss');
// const autoprefix = require('gulp-autoprefixer');
const RouteDisplay = require('foxman-plugin-route-display');
const MockControl = require('foxman-plugin-mock-control');
const Automount = require('foxman-plugin-automount');
const WebpackDevServer = require('foxman-plugin-webpack-dev-server');

function urlTransformer (ip) {
    return function (reqPath) {
        return `http://${ip}/${reqPath}`;
    }
}

const paths = {
    webapp: __dirname
}

Object.assign(paths, {
    viewRoot: path.join(paths.webapp, 'template'),
    syncData: path.join(paths.webapp, 'mock', 'sync'),
    asyncData: path.join(paths.webapp, 'mock', 'async')
});

Object.assign(paths,{
    commonTpl: path.join(paths.webapp, 'commonTpl')
});

Object.assign(paths,{
    src: path.join(__dirname, 'src')
});

module.exports = {
    /**
     * 如有需要，填写nei 的kei 然后执行 foxman -u 初始化工程目录。
     **/
    // nei: {
        // key: 'xxxsxsxs'
    // },

    plugins: [
        new RouteDisplay(),

        new MockControl({
            /**
             * 在 mock json 的同目录下找，文件名一样 的 .js 文件, 默认如下
             * @param dataPath
             * @returns {string|*|XML|void}
             */
            mapJS: function (dataPath) {
                return dataPath.replace(/\.json$/, '.js');
            }
        }),

        new Automount({
            tplUrlMap: {
                '/index.html': 'foo.bar'
            }
        }),

        new WebpackDevServer({
            webpackConfig,
            devServerConfig:{
                quiet: true,
                noInfo: true,
                lazy: false
            }
        })

    ],

    /**
     * task集合(基于gulp文件处理，故所有gulp插件都可用)
     * test -- String or Array<String> 需要进行转换的文件规则
     * handler -- Function 类型，需返回一个数组
     */
    // preCompilers: [
    //     {
    //         test: [path.join(__dirname, 'src', 'mcss', '**', '[^_]*.mcss')],
    //         handler: (dest) => {
    //             return [
    //                 mcss({
    //                     "include": [],
    //                     "format": 1
    //                 }),
    //                 autoprefix({
    //                     browsers: ['Android >= 2.3'],
    //                     cascade: false
    //                 }),
    //                 dest(path.join(__dirname, 'src', 'css'))
    //             ]
    //         }
    //     }
    // ],

    /**
     * 需要watch的根目录，缺省值为 foxman.config.js 所在目录的所有文件
     */
    watch: {
        root: paths.webapp
    },

    proxy: {
        host: 'm.kaola.com',
        service: {
            test(reqPath) {
                return urlTransformer('106.2.44.36')(reqPath);
            }
        }
    },

    /**
     * 服务配置
     */
    server: {
        /**
         * 路由表 格式参见 @routers
         */
        routers,
        /**
         * 端口
         */
        port: 9000,
        /**
         * 是否区分方法
         */
        divideMethod: !!0,
        /**
         * 是否启用 https
         */
        https: !!0,
        /**
         * 引入的 templatePaths，根据具体的 View Render 配置
         */
        templatePaths: {
            commonTpl: paths.commonTpl
        },
        /**
         * router type 为 sync 的filePath的ftl相对目录
         */
        viewRoot: paths.viewRoot,
        /**
         * router type 为 sync 的filePath的data相对目录
         */
        syncData: paths.syncData,
        /**
         * router type 为 async 的filepath的data相对目录
         */
        asyncData: paths.asyncData,
        /**
         * 静态资源目录
         */
        static: [ paths.src ]
    }
};