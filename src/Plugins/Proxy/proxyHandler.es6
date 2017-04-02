import zlib from 'zlib';
import url from 'url';
import {ServerResponse} from 'http';

import {util} from '../../helper';

export default function handler({
    proxy,
    service
}) {
    const target = url.parse(service(this.request.url.replace(/^(\/)/, '')));
    const res = new ServerResponse(Object.assign({}, this.req, {url: target.path}));
    const data = [];
    const write = res.write;
    
    res.write = function (chunk) {
        data.push(chunk);
        return write(chunk);
    };

    proxy.web(this.req, res, {
        target: target.protocol + '//' + target.host
    });

    return new Promise(resolve => {
        res.once('proxyEnd', (req, res) => {
            resolveRes({resHeaders: res._headers,res});
        });
    });
}

function resolveRes({
    resHeaders, resolve
}) {
    for (var name in resHeaders) {
        if ('transfer-encoding' !== name 
            && 'content-encoding'!== name) {
            this.set(name, resHeaders[name]);
        }
    }

    const buffer = Buffer.concat(data);
    const encoding = resHeaders['content-encoding'];
    
    if (encoding === 'gzip') {
        return zlib.gunzip(buffer, function (err, decoded) {
            resolve(decoded.toString());
        });
    }
    
    if (encoding === 'deflate') {
        return zlib.inflate(buffer, function (err, decoded) {
            resolve(decoded.toString());
        });
    }

    resolve(buffer.toString());
}