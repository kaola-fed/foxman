const { parser, fs, promise, logger } = require('@foxman/helpers');

function apiHandler({ handler, dataPath }) {
    if (handler) {
        return handlerInvkoe(handler);
    }
    return (Array.isArray(dataPath)? 
            readJSONs(dataPath): 
            readJSON(dataPath)).then(json => ({json}));
}

function handlerInvkoe(handler) {
    return promise.ensurePromise(handler(this)).then(json => {
        
        if (typeof json === 'string') {
            return {
                json: safeJsonParse(json)
            };
        }

        return { json };
    });
}

function safeJsonParse(jsonstr) {
    let json;
    try {
        json = parser.parseJSON(jsonstr);
    } catch (error) {
        return Promise.reject(
            `${error.stack || error} \n 源数据：\n ${json}`
        );
    }
    return json;
}

function readJSONs(dataPath) {
    return Promise.all(
        dataPath.map(readJSON)
    ).then(
        resps => 
            resps.reduce((bef, aft) => 
                Object.assign(bef, aft), {})
    );
}

function readJSON(url) {
    return fs.readJSONFile(url).catch(() => {
        logger.warn(`File '${url}' is not found, so foxman while output empty object ({}).`);
        return {};
    });
}

module.exports = apiHandler;
