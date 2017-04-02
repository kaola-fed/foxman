/**
 * dispatcher
 * type
 * filePath
 * tplPath
 * dataPath(sync才有)
 */
import {
    util, DispatherTypes
} from '../../../helper';
import path from 'path';
import pathToRegexp from 'path-to-regexp';

/**
 * 全局中间件,会将具体的页面转换成需要的资源
 * 1.同步
 *  { commonTplPath,commonSync }
 * 2.异步
 *  { commonAsync }
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */

const getDispatcherMap = ({extension}) => {
    const dispatcherMap = new Map();
    dispatcherMap.set('/', {
        type: DispatherTypes.DIR
    });
    dispatcherMap.set(`.${extension}`, {
        type: DispatherTypes.SYNC
    });
    dispatcherMap.set('.json', {
        type: DispatherTypes.ASYNC
    });
    return dispatcherMap;
};

const {values, removeSuffix, addDataExt, jsonPathResolve} = util;

export default ({
    runtimeRouters, // structor
    extension, divideMethod, // string
    viewRoot, syncData, asyncData, // paths
    syncDataMatch, asyncDataMatch // fns
}) => {
    const dispatcherMap = getDispatcherMap({extension});
    return function*(next) {
        /**
         * ① 拦截 router
         * @type {[type]}
         */
        const {method, query} = this.request;
        const routers = values(runtimeRouters).reduce((prev, item) => prev.concat(item), []);
        
        if (Number(query.mode) !== 1) {
            /**
             * 遍历路由表,并给请求对象处理,生成 this.dispatcher
             */
            for (let router of routers) {

                if (divideMethod && router.method.toUpperCase() !== method.toUpperCase()) {
                    continue;
                }

                if (!pathToRegexp(router.url).test(this.request.path)) {
                    continue;
                }

                let filePath = router.filePath;

                if (router.sync) {
                    const tplName = removeSuffix(router.filePath, extension);
                    let pagePath = path.join(viewRoot, `${tplName}.${extension}`);
                    let dataPath = addDataExt(syncData, tplName);
                    this.dispatcher = {
                        type: 'sync',
                        pagePath,
                        dataPath
                    };
                } else {
                    let dataPath = addDataExt(asyncData, router.filePath);
                    this.dispatcher = {
                        type: 'async',
                        dataPath
                    };
                }

                this.dispatcher.filePath = filePath;
                this.dispatcher.isRouter = true;
                this.dispatcher.handler = router.handler;

                return yield next;
            }
        }

        /**
         * ② 未拦截到 router 入口时，自动转换
         */
        let requestPath = (this.request.path === '/') ? '/index.html' : this.request.path;
        let jsonPath = jsonPathResolve(requestPath);
        for (let [type, route] of dispatcherMap) {
            if (this.request.path.endsWith(type)) {
                this.dispatcher = {
                    type: route.type,
                    isRouter: false,
                    filePath: requestPath,
                    pagePath: path.join(viewRoot, this.request.path),
                    dataPath: {
                        [DispatherTypes.DIR]: null,
                        [DispatherTypes.SYNC]: syncDataMatch(jsonPath),
                        [DispatherTypes.ASYNC]: asyncDataMatch(jsonPath)
                    }[route.type]
                };
                return yield next;
            }
        }
        return yield next;
    };
};
