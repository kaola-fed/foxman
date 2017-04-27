'use strict';
const path = require('path');
const Forward = require('../lib');

function urlTransformer(ip) {
    return function(reqPath) {
        return `http://${ip}/${reqPath}`;
    };
}

const paths = {
    webapp: __dirname
};

Object.assign(paths, {
    viewRoot: path.join(paths.webapp, 'template'),
    syncData: path.join(paths.webapp, 'mock', 'sync'),
    asyncData: path.join(paths.webapp, 'mock', 'async')
});

Object.assign(paths, {
    src: path.join(__dirname, 'src')
});

module.exports = {
    plugins: [
        new Forward({
            routes: [
                {
                    from: '/wxConfig.html',
                    to: 'http://m.kaola.com/wxConfig.html'
                },
                {
                    from: '/123',
                    to: 'http://m.kaola.com'
                }
            ]
        })
    ],

    processors: [],

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
        routers: [
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
        divideMethod: !!0,
        https: !!0,
        viewRoot: paths.viewRoot,
        syncData: paths.syncData,
        asyncData: paths.asyncData,
        static: []
    }
};
