const {util: _ } = require('@foxman/helpers');
const path = require('path');
const pathToRegexp = require('path-to-regexp');
const {consts} = require('@foxman/helpers');
const {DIR, SYNC} = consts.DispatherTypes;

const { values, removeSuffix, addDataExt, jsonPathResolve } = _;

// 获得路由的 dispatcher 对象
function mapRouter(
    {
        runtimeRouters,
        reqQuery,
        reqMethod,
        reqPath,
        viewRoot,
        extension,
        divideMethod,
        syncDataMatch,
        asyncDataMatch
    }
) {
    if (Number(reqQuery.mode) === 1) {
        return;
    }

    let dispatcher;
    const routers = values(runtimeRouters).reduce(
        (prev, item) => prev.concat(item),
        []
    );
    routers.some(function(router) {
        const { filePath, sync, method, url, handler } = router;

        if (divideMethod && method.toUpperCase() !== reqMethod.toUpperCase()) {
            return false;
        }

        if (!pathToRegexp(url).test(reqPath)) {
            return false;
        }

        dispatcher = {
            router,
            filePath,
            handler
        };

        if (sync) {
            const tplName = removeSuffix(filePath, extension);
            return Object.assign(dispatcher, {
                type: 'sync',
                pagePath: path.join(viewRoot, `${tplName}.${extension}`),
                dataPath: syncDataMatch(addDataExt(tplName))
            });
        }

        return Object.assign(dispatcher, {
            type: 'async',
            dataPath: asyncDataMatch(addDataExt(filePath))
        });
    });

    return dispatcher;
}

function mapResource({
        reqQuery,
        reqPath,
        extension,
        viewRoot,
        syncDataMatch
    }) {
    if (Number(reqQuery.mode) !== 1 && reqPath === '/') {
        reqPath = '/index.html';
    }

    const dispatcherMap = {
        ['/']: {
            type: DIR,
            dataPath: null
        },
        [`.${extension}`]: {
            type: SYNC,
            dataPath: syncDataMatch(jsonPathResolve(reqPath))
        }
    };

    let dispatcher;

    Object.keys(dispatcherMap).some(endFlag => {
        if (reqPath.endsWith(endFlag)) {
            const { type, dataPath } = dispatcherMap[endFlag];
            dispatcher = {
                type,
                filePath: reqPath,
                pagePath: path.join(viewRoot, reqPath),
                dataPath
            };
            return true;
        }
    });

    return dispatcher;
}

module.exports = (
    {
        runtimeRouters, 
        extension,
        divideMethod, 
        viewRoot,
        syncDataMatch,
        asyncDataMatch
    }
) => {
    return function*(next) {
        const { method, query, path } = this.request;
        const [reqPath, reqMethod, reqQuery] = [path, method, query];

        const routerDispatcher = mapRouter({
            runtimeRouters,
            reqQuery,
            reqMethod,
            reqPath,
            viewRoot,
            extension,
            divideMethod,
            syncDataMatch,
            asyncDataMatch
        });
        const resourcesDispatcher = mapResource({
            reqPath,
            reqQuery,
            extension,
            viewRoot,
            syncDataMatch
        });
        this.dispatcher = routerDispatcher || resourcesDispatcher;

        return yield next;
    };
};
