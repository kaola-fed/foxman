const zlib = require('zlib');
const url = require('url');
const {ServerResponse} = require('http');

module.exports = function handler(
    {
        proxy,
        service
    }
) {
    const target = url.parse(service(this.request.url.replace(/^(\/)/, '')));
    const res = new ServerResponse(
        Object.assign({}, this.req, {url: target.path})
    );
    const body = [];

    res.write = function(chunk) {
        body.push(chunk);
        return true;
    };

    proxy.web(this.req, res, {
        target: target.protocol + '//' + target.host
    });

    return new Promise(resolve => {
        res.once('proxyEnd', (req, res) => {
            resolveRes({
                ctx: this,
                body,
                resolve,
                res
            });
        });
    });
};

function resolveRes(
    {
        ctx,
        res,
        body,
        resolve
    }
) {
    const headers = res._headers;
    const buffer = Buffer.concat(body);
    const resolveRes = wrapperResolve(resolve);

    for (var name in headers) {
        if ('transfer-encoding' !== name && 'content-encoding' !== name) {
            ctx.set(name, headers[name]);
        }
    }

    switch (headers['content-encoding']) {
    case 'gzip':
        return zlib.gunzip(buffer, function(err, decoded) {
            resolveRes(decoded);
        });
    case 'deflate':
        return zlib.inflate(buffer, function(err, decoded) {
            resolveRes(decoded);
        });
    default:
        resolveRes(buffer);
    }
}

function wrapperResolve(resolve) {
    return function(body) {
        resolve(body.toString());
    };
}
