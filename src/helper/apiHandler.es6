import {JSONParse, jsonResolver} from './util';

function apiHandler({
    handler,
    dataPath
}) {
    if (handler) {
        return handler(this).then(res => {
            let {body = res} = res;
            if (typeof body === 'string') {
                try {
                    body = JSONParse(body);
                } catch (error) {
                    return Promise.reject(`${error.stack || error} \n 源数据：\n ${body}`);
                }
            }
            return {json: body};
        });
    }

    if (Array.isArray(dataPath)) {
        return Promise.all(dataPath.map(url => {
            return jsonResolver({url});
        })).then(resps => {
            return resps.reduce((bef, aft) => {
                return {
                    json: Object.assign(bef.json, aft.json)
                };
            });
        });
    }
    
    return jsonResolver({url: dataPath});
}

export default apiHandler;