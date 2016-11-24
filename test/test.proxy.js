"use strict";

const util = require('../src/helper/util');
const http = require('http');
const httpProxy = require('http-proxy');
const ServerResponse = http.ServerResponse;
const proxy = httpProxy.createProxyServer({target: 'http://m.kaola.com/'});
const zlib = require('zlib');

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
  proxyReq.setHeader('Host', 'm.kaola.com');
});

proxy.on('end', function(req, res, proxyRes){
    res.emit('proxyEnd', req, res, proxyRes);
});

var server = http.createServer(function(req, resp) {
    var res = new ServerResponse(req);
    var data = [];

    res.write = function (chunk) {
        data.push(chunk);
        return true;
    }

    proxy.web(req, res, {});

    res.once('proxyEnd', function(req, res, proxyRes){
        for (var name in res._headers) {
            resp.setHeader(
                name, res._headers[name]
            )
        }
        const buffer = Buffer.concat(data);
        const encoding =  res._headers['content-encoding'];
        if (encoding == 'gzip') {
            zlib.gunzip(buffer, function (err, decoded) {
                data = decoded.toString();
                resp.end(data);
            });
        } else if (encoding == 'deflate') {
            zlib.inflate(buffer, function (err, decoded) {
                data = decoded.toString();
                resp.end(data);
            });
        } else {
            data = buffer.toString();
            resp.end(data);
        } 
       
    });
});

console.log("listening on port 5050")
server.listen(5050);