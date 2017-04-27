/**
 * Created by hzxujunyu on 2016/9/27.
 */
'use strict'
/****************** IMPORT START ******************/
const path = require('path')
const resolve = path.resolve
/****************** IMPORT END ******************/


/****************** ROUTERS START ******************/
/**
 * @Router
 *  @Property method: 'POST',
 *  @Property url: '/categoryAdviser/categoryOverview/transformOverview',
 *  @Property sync: false,
 *  @Property filePath 'post/categoryAdviser/categoryOverview/transformOverview
 *  @type {Object}
 */
const Router = {
    method: 'GET',
    url: '/foo.html',
    sync: false,
    filePath: 'foo.json'
}
/**
 * @Routers
 * @type {Array<Router>}
 */
const Routers = [Router]
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
        new (require('foxman-plugin-mock-control'))({})
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
