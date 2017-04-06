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

const {values, removeSuffix, addDataExt, jsonPathResolve} = util;


/**
 * ① 拦截 router
 * 遍历路由表, 并给请求对象处理,生成 dispatcher
 */
function getRouterDispatcher({
    runtimeRouters, 
    reqQuery, reqMethod, reqPath,
    viewRoot, extension, divideMethod,
    syncDataMatch, asyncDataMatch
}) {
    if (Number(reqQuery.mode) === 1) {
        return;
    }

    let dispatcher;
    const routers = values(runtimeRouters).reduce((prev, item) => prev.concat(item), []);
    routers.some(function (router) {
        const { filePath, sync, method, url, handler} = router;

        if (divideMethod && method.toUpperCase() !== reqMethod.toUpperCase()) {
            return false;
        }
        
        if (!pathToRegexp(url).test(reqPath)) {
            return false;
        }

        dispatcher = {
            router, filePath, handler
        };

        if (sync) {
            const tplName = removeSuffix(filePath, extension);
            return Object.assign(dispatcher,{
                type: 'sync',
                pagePath: path.join(viewRoot, `${tplName}.${extension}`),
                dataPath: syncDataMatch(addDataExt(tplName))
            });
        } 

        return Object.assign(dispatcher,{
            type: 'async',
            dataPath: asyncDataMatch(addDataExt(filePath))
        });
    });

    return dispatcher;
}


/**
 * ② 未拦截到 router 入口时，拦截 router
 */
function getResourcesDispatcher ({
    reqQuery, reqPath, 
    extension, viewRoot,
    syncDataMatch
}) {
    if ((Number(reqQuery.mode) !== 1) && (reqPath === '/')) {
        reqPath = '/index.html';
    }

    const DIR = '/';
    const SYNC = `.${extension}`;
    const dispatcherMap = {
        [DIR]: {
            type: DispatherTypes.DIR,
            dataPath: null
        },
        [SYNC]: {
            type: DispatherTypes.SYNC,
            dataPath: jsonPathResolve(syncDataMatch(reqPath))
        }
    };

    let dispatcher;

    Object.keys(dispatcherMap).some((endFlag) => {
        if (reqPath.endsWith(endFlag)) {
            const {type, dataPath} = dispatcherMap[endFlag];
            dispatcher = {
                type, filePath: reqPath,
                pagePath: path.join(viewRoot, reqPath),dataPath
            };
            return true;
        }
    });

    return dispatcher;
}

export default ({
    runtimeRouters, // structor
    extension, divideMethod, // string
    viewRoot, //path
    syncDataMatch, asyncDataMatch // fns
}) => {
    return function*(next) {
        const {method, query, path} = this.request;
        const [reqPath, reqMethod, reqQuery] = [path, method, query];
        
        const routerDispatcher = getRouterDispatcher({
            runtimeRouters, 
            reqQuery, reqMethod, reqPath,
            viewRoot, extension, divideMethod,
            syncDataMatch, asyncDataMatch
        });
        const resourcesDispatcher = getResourcesDispatcher({
            reqPath, reqQuery,
            extension, viewRoot, syncDataMatch
        });
        this.dispatcher = (routerDispatcher || resourcesDispatcher);

        return yield next;
    };
};