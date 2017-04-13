const {parseJSON, readJSONFile} = require('./util');

function apiHandler({handler, dataPath}) {
    if (handler) {
        return handler(this).then(res => {
            if (typeof res === 'string') {
                try {
                    res = parseJSON(res);
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
                return readJSONFile(url);
            })
        ).then(resps => {
            return resps.reduce((bef, aft) => {
                return {
                    json: Object.assign(bef.json, aft.json)
                };
            });
        });
    }

    return readJSONFile(dataPath);
}

module.exports = apiHandler;
