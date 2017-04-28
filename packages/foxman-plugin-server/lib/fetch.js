const { JSON, fs, promise, path } = require('@foxman/helpers');
const logger = require('./logger');

function fetch({ handler, dataPath }) {
    if (handler) {
        return handlerInvkoe.call(this, handler);
    }
    return (Array.isArray(dataPath)
        ? readJSONs(dataPath)
        : readJSON(dataPath)).then(json => ({ json }));
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
        json = JSON.parse(jsonstr);
    } catch (error) {
        return new Error(`${error.stack || error} \n 源数据：\n ${json}`);
    }
    return json;
}

function readJSONs(filepaths) {
    return Promise.all(filepaths.map(readJSON)).then(jsons =>
        jsons.reduce((total, current) => Object.assign(total, current), {})
    );
}

function readJSON(filepath) {
    return fs.readJSONFile(filepath).catch((error) => {
        if (error.code === 'ENOENT') {
            logger.warn(
                `File '${path.shorten(filepath)}' is not found, so foxman will output empty object ({}).`
            );
        } else {
            logger.warn(
                `File '${path.shorten(filepath)}' is parsed error:`
            );
            logger.warn(
                error
            );
        }
        return {};
    });
}

module.exports = fetch;
