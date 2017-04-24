const { typer, string } = require('@foxman/helpers');
const pathToRegexp = require('path-to-regexp');
const { values } = typer;
const { removeSuffix, ensureJSONExtension } = string;
const path = require('path');

// 获得路由的 dispatcher 对象
function createRouterDispatcher({
    runtimeRouters,
    reqQuery,
    reqMethod,
    reqPath,
    viewRoot,
    extension,
    syncDataMatch,
    asyncDataMatch
}) {
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

        if ( method.toUpperCase() !== reqMethod.toUpperCase()) {
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
                dataPath: syncDataMatch(ensureJSONExtension(tplName))
            });
        }

        return Object.assign(dispatcher, {
            type: 'async',
            dataPath: asyncDataMatch(ensureJSONExtension(filePath))
        });
    });

    return dispatcher;
}

module.exports = ({
    runtimeRouters,
    extension,
    viewRoot,
    syncDataMatch,
    asyncDataMatch
}) => {
    return function*(next) {
        const {
            method: reqMethod,
            query: reqQuery,
            path: reqPath
        } = this.request;

        if (this.dispatcher) {
            return yield next;
        }
        
        this.dispatcher = createRouterDispatcher({
            runtimeRouters,
            reqQuery,
            reqMethod,
            reqPath,
            viewRoot,
            extension,
            syncDataMatch,
            asyncDataMatch
        });

        return yield next;
    };
};
