const { string } = require('@foxman/helpers');
const path = require('path');
const { consts } = require('@foxman/helpers');
const { DIR, SYNC } = consts.DispatherTypes;

const { jsonPathResolve } = string;

function createResourceDispatcher({
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

module.exports = ({
    extension,
    viewRoot,
    syncDataMatch
}) => {
    return function*(next) {
        const {
            query: reqQuery,
            path: reqPath
        } = this.request;
        
        if (this.dispatcher) {
            return yield next;
        }
        
        this.dispatcher = createResourceDispatcher({
            reqPath,
            reqQuery,
            extension,
            viewRoot,
            syncDataMatch
        });

        return yield next;
    };
};
