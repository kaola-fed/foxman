const {parser, fs, promise} = require('@foxman/helpers');

function apiHandler({handler, dataPath}) {
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
            return {json: res};
        });
    }

    if (Array.isArray(dataPath)) {
        return Promise.all(
            dataPath.map(url => {
                return fs.readJSONFile(url);
            })
        ).then(resps => {
            return resps.reduce((bef, aft) => {
                return {
                    json: Object.assign(bef.json, aft.json)
                };
            });
        });
    }

    return fs.readJSONFile(dataPath);
}

module.exports = apiHandler;
