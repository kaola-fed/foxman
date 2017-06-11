const path = require('path');
const MockControl = require('@foxman/plugin-mock-control');
const PATHES = {
    viewRoot: path.join(__dirname, 'tpl'),
    syncData: path.join(__dirname, 'mock/page'),
    asyncData: path.join(__dirname, 'mock/api'),
    src: 'src'
};

module.exports = {
    plugins: [
        new MockControl({
            /**
             * 在 mock json 的同目录下找，文件名一样 的 .js 文件, 【默认如下】
             * @param dataPath
             * @returns {string|*|XML|void}
             */
            mapJS: function (dataPath) {
                return dataPath.replace(/\.json$/, '.js');
            }
        })
    ],
    routes: [
        {
            method: 'GET',
            url: '/jsonp.html',
            sync: false,
            filePath: 'example.2'
        }, {
            method: 'GET',
            url: '/download.html',
            sync: false,
            filePath: 'example.3'
        }, {
            method: 'GET',
            url: '/jsonp.2.html',
            sync: false,
            filePath: 'example.5'
        }
    ],
    port: 9000,
    secure: false,
    extension: 'ftl',
    viewRoot: PATHES.viewRoot,
    syncData: PATHES.syncData,
    asyncData: PATHES.asyncData,
    statics: [PATHES.src]
};
