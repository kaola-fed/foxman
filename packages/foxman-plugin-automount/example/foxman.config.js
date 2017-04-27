/**
 * Created by hzxujunyu on 2016/9/27.
 */
'use strict'
/****************** IMPORT START ******************/
const path = require('path')
const resolve = path.resolve
/****************** IMPORT END ******************/
const Routers = []
/****************** ROUTERS END ******************/


/****************** PATHS START ******************/
const paths = (function () {
	const paths = {
	    webapp: __dirname
	}

	Object.assign(paths, {
		viewRoot: resolve(paths.webapp, 'template'),
		syncData: resolve(paths.webapp, 'mock', 'sync'),
		asyncData: resolve(paths.webapp, 'mock', 'async')
	})

	Object.assign(paths, {
		src: resolve(paths.webapp, 'src'),
		res: resolve(paths.webapp, 'res')
	})

    return paths
}())
/****************** PATHS END ******************/


/****************** COMMONURL START ******************/
const commonUrl = function (ip) {
    return function (url) {
        return [
            'http://',
            ip,
            '/',
            url
        ].join('')
    }
}
/****************** COMMONURL END ******************/


module.exports = {
    plugins: [
        new (require('..'))({
            tplUrlMap: {
                '/index.html': 'index',
                '/index2.html': 'index',
            },
            /**
             * 同步接口 xxx.ftl 映射实际url的接口，默认如下
             * @param ftlPath(不带后缀)
             * @returns {string|*|XML|void} 
             */
            syncDataMatch: ftlPath => { 
                return '/' + ftlPath + '.html'; 
            },
            /**
             * 异步接口 xxx.json 映射实际url的接口，默认如下
             * @param dataPath(不带后缀)
             * @returns {string|*|XML|void} 
             */
            asyncDataMatch: dataPath => {
                return '/' + dataPath + '.html'; 
            }
        })
    ],
    server: {
        routers: Routers,
        port: 8888,
        divideMethod: !!0,
        debugTool: !0,
        viewRoot: paths.viewRoot,
        syncData: paths.syncData,
        asyncData: paths.asyncData,
        static: [
            paths.src,
            paths.res
        ]
    }
}
