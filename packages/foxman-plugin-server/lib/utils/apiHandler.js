const { parser, fs, promise, logger } = require('@foxman/helpers');

function apiHandler({ handler, dataPath }) {
    if (handler) {
        return promise.ensurePromise(handler(this)).then(res => {
            if (typeof res === 'string') {
                try {
                    res = parser.parseJSON(res);
                } catch (error) {
                    return Promise.reject(
                        `${error.stack || error} \n 源数据：\n ${res}`
                    );
                }
            }
            return { json: res };
        });
    }

    if (Array.isArray(dataPath)) {
        return Promise.all(
            dataPath.map(url => {
                return fs.readJSONFile(url).catch(function() {
                    logger.warnLog(`File '${url}' is not found, so foxman while output empty Object ({}).`);
                    return {};
                });
            })
        ).then(resps => {
            return  {
                json: resps.reduce((bef, aft) => {
                    return Object.assign(bef, aft);
                }, {})
            };
        });
    }

    return fs.readJSONFile(dataPath).then(json => ({ json }));
}

module.exports = apiHandler;
