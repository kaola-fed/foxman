```javascript
'use strict';
/****************** IMPORT START ******************/
const path = require('path');
const resolve = path.resolve;
/****************** IMPORT END ******************/


/****************** ROUTERS START ******************/
/**
 * @Router
 *  @Property method: 'POST',
 *  @Property url: '/foo',
 *  @Property sync: false,
 *  @Property filePath 'foo/bar'
 *  @type {Object}
 */
const Router = {
    method: 'POST',
    url: '/foo.html',
    sync: false,
    filepath: 'foo.json'
};
/**
 * @Routers
 * @type {Array<Router>}
 */
const Routers = [
    /** Router **/
];
/****************** ROUTERS END ******************/


/****************** PATHS START ******************/
const paths = (function () {
    const paths = {};

    Object.assign(paths, {
        webapp: resolve(__dirname, 'src', 'main', 'webapp')
    });

    Object.assign(paths, {
        viewRoot: resolve(paths.webapp, 'WEB-INF', 'tpl'),
        syncData: resolve(paths.webapp, 'mock', 'sync'),
        asyncData: resolve(paths.webapp, 'mock', 'async')
    });

    Object.assign(paths, {
        src: resolve(paths.webapp, 'source'),
        res: resolve(paths.webapp, 'res')
    });

    Object.assign(paths, {
        mcssSrc: resolve(paths.src, 'mcss/**/[^_]*.mcss'),
        components: resolve(paths.src, 'javascript/components'),
        mcssTarget: resolve(paths.src, 'css/')
    });

    return paths;
}());
/****************** PATHS END ******************/


/****************** COMMONURL START ******************/
const commonUrl = function (ip) {
    const address = [ 'http://', ip, '/'].join('');
    return (url) => (address + url);
};
/****************** COMMONURL END ******************/


module.exports = {
    nei: {
        key: 'xxxxxxxx'
    },
    plugins: [
        new (require('foxman-plugin-mock-control'))({
            mapJS: function (dataPath) {
                return (function (jsMockPath) {
                    /**
                     * If you can't find out ${jsMockPath}. You could open this comment.
                     * cosnole.log(jsMockPath);
                     */
                    return jsMockPath;
                }(dataPath.replace(/\.json/g, '.js')));
            }
        }),
        new (require('foxman-plugin-route-display'))()
    ],
    preCompilers: [
        {
            test: [paths.mcssSrc],
            handler: function (dest) {
                return [
                    require('foxman-mcss')({
                        "include": [paths.components],
                        "format": 1
                    }),
                    require('gulp-autoprefixer')({
                        browsers: ['Android >= 2.3'],
                        cascade: false,
                        remove: false
                    }),
                    dest(paths.mcssTarget)
                ];
            }
        }
    ],
    watch: {
        root: paths.webapp
    },
    proxy: {
        host: 'm.kaola.com',
        /**
         * Proxy Controller
         * @param url
         * @returns {string}
         * If You Want To add Proxy Service，Please Add A Function At service, And Run as ```foxman -p ${proxy_name}```
         * Example： foxman -P hst_test10
         */
        service: {
            test (url) {
                return commonUrl('m.kaola.com')(url);
            }
        }
    },
    server: {
        routers: Routers,
        port: 9999,
        divideMethod: !!0,
        debugTool: !0,
        viewRoot: paths.viewRoot,
        syncData: paths.syncData,
        asyncData: paths.asyncData,
        static: [
            paths.src,
            paths.res,
        ]
    }
};
```