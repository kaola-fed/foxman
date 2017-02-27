import {util} from '../../helper';
import httpProxy from 'http-proxy';
import {ServerResponse} from 'http';
import zlib from 'zlib';
import url from 'url';

/**
 * 全局代理插件
 */
class ProxyPlugin {
    constructor(options) {
        Object.assign(
            this,
            options
        );
        this.enable = !!(this.proxyServerConfig && this.proxyConfig);

        if (this.enable && !this.proxyConfig.host) {
            util.warn('proxy 部分需要设置 host');
        }

        this.ifProxy = this.enable; // 兼容 mockControl
    }

    init(serverPlugin) {
        this.proxy = httpProxy.createProxyServer({});
        this.proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
            proxyReq.setHeader('Host', this.proxyConfig.host);
        });
        this.proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });

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
        routes.forEach((router) => {
            router.handler = (ctx) => {
                return handler.call(ctx);
            };
        });

        util.log(`Proxying to remote server ${this.proxyServerConfig}`);

        function handler() {
            const target = url.parse(service(this.request.url.replace(/^(\/)/, '')));
            const req = this.req;
            req.url = target.path;

            const res = new ServerResponse(req);
            const data = [];
            res.write = function (chunk) {
                data.push(chunk);
                return true;
            };

            proxy.web(this.req, res, {
                target: target.protocol + '//' + (target.host || this.proxyConfig.host)
            });

            return new Promise(resolve => {
                res.once('proxyEnd', (req, res) => {
                    for (var name in res._headers) {
                        if (!~[
                                'transfer-encoding',
                                'content-encoding'
                            ].indexOf(name)) {
                            this.set(name, res._headers[name]);
                        }
                    }

                    const buffer = Buffer.concat(data);
                    const encoding = res._headers['content-encoding'];
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
