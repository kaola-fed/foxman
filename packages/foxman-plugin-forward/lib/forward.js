// https://github.com/nswbmw/koa-forward-request/
const request = require('request');
const isUrl = require('is-url');

module.exports = function(url, options) {
    options = options || {};

    if (isUrl(url)) {
        options.url = options.url || url;
    } else {
        options.url = options.url || url;
        options.baseUrl = options.baseUrl || this.protocol + '://' + this.host;
    }
    options.method = options.method || this.method;
    delete this.header.host;
    options.headers = options.headers || this.header;
    options.qs = options.qs || this.query;

    switch (this.is('json', 'urlencoded')) {
    case 'json':
        delete options.headers['content-length'];
        options.body = options.body || this.request.body;
        options.json = true;
        break;
    case 'urlencoded':
        options.form = options.form || this.request.body;
        break;
    default:
        if (!~['HEAD', 'GET', 'DELETE'].indexOf(options.method)) {
            options.body = options.body || this.request.body;
        }
    }
    var self = this;
    self.respond = false;

    request(options)
        .on('error', function(err) {
            if (['ENOTFOUND', 'ECONNREFUSED'].indexOf(err.code) !== -1) {
                self.res.statusCode = 404;
                self.res.end();
            } else {
                console.error(err);
                throw err;
            }
        })
        .pipe(self.res);
};
