import { util, fileUtil } from "../../helper";
import http from 'http';
import httpProxy from 'http-proxy';
import {ServerResponse} from 'http';
import zlib from 'zlib';

/**
 * 全局代理插件
 */
class ProxyPlugin {
    constructor(options) {
        Object.assign(
            this,
            options
        );
    }

    init(serverPlugin) {
        this.proxy = httpProxy.createProxyServer({target: 'http://m.kaola.com/'});
        this.proxy.on('proxyReq', function(proxyReq, req, res, options) {
            proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
            proxyReq.setHeader('Host', 'm.kaola.com');
        });

        this.proxy.on('end', function(req, res, proxyRes){
            res.emit('proxyEnd', req, res, proxyRes);
        });
        /**
         * 命令行选项
         */
        if (!this.proxyConfig) {
            return false;
        }
        this.server = serverPlugin.server;
        const proxyConfig = this.proxyConfig;

        proxyConfig.service = proxyConfig.service || {};

        if (Object.keys(proxyConfig.service).indexOf(this.proxyServerConfig) == -1) {
            util.error('请核对配置文件，并设置正确的代理服务别名');
        }

        this.updateRoutes(proxyConfig.service[this.proxyServerConfig]);
    }

    updateRoutes(service) {
        const routes = this.server.routers;
        const proxy = this.proxy;
        const host = this.proxy.host;
        routes.forEach((router) => {
            router.handler = (ctx) => {
                return handler.call(ctx);
            };
        });
        util.log("代理已生效");

        function handler() {
            const url = service(this.request.url.replace(/^(\/)/, ''));
            const req = this.req;
            req.url = url;
            const res = new ServerResponse(req);
            const data = [];
            res.write = function (chunk){
                data.push(chunk)
                return true;
            }

            proxy.web(this.req, res, {});

            return new Promise((resolve,reject)=>{
                res.once('proxyEnd', (req, res, proxyRes) => {
                    for (var name in res._headers) {
                        if(!~[
                                'transfer-encoding',
                                'content-encoding'
                                ].indexOf(name)){
                            this.set(name, res._headers[name]);
                        }
                    }

                    const buffer = Buffer.concat(data);
                    const encoding =  res._headers['content-encoding'];
                    if (encoding == 'gzip') {
                        zlib.gunzip(buffer, function (err, decoded) {
                            resolve(decoded.toString());
                        });
                    } else if (encoding == 'deflate') {
                        zlib.inflate(buffer, function (err, decoded) {
                            resolve(decoded.toString());
                        });
                    } else {
                        resolve(buffer.toString());
                    }
                });
            });
        }
    }
}

export default ProxyPlugin;
