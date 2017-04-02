import {util} from '../../helper';
import httpProxy from 'http-proxy';


/**
 * 全局代理插件
 */
class ProxyPlugin {
    constructor({
        proxyServerConfig, proxyConfig
    }) {
        const {service = {}} = proxyConfig;
        this.enable = !!(proxyServerConfig && proxyConfig);

        if (this.enable) {
            if (!options.proxyConfig.host) {
                util.error('To configure config proxy.host');
            }

            if (Object.keys(service).indexOf(proxyServerConfig) == -1) {
                util.error('To check config, and input correct proxyServer name');
            }
        }

        Object.assign(this, {proxyServerConfig, proxyConfig});
    }

    init(serverPlugin) {
        const {proxyConfig, proxyServerConfig} = this;
        this.server = serverPlugin.server;
        this.initProxy();
        this.registerProxy(proxyConfig.service[proxyServerConfig]);
    }

    initProxy() {
        const {proxyConfig, proxyServerConfig} = this;
        const proxy = this.proxy = httpProxy.createProxyServer({});
        proxy.on('proxyReq', proxyReq => {
            proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
            proxyReq.setHeader('Host', this.proxyConfig.host);
        });
        proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });
    }

    registerProxy(service) {
        this.server.updateRuntimeRouters(routes => 
            routes.map(router => 
                Object.assign(router, {
                    handler: ctx => {
                        handler.call(ctx, {
                            proxy: this.proxy,
                            targetHost: this.proxyConfig.host
                        });
                    }
                })));
        util.notify({
            title: 'Proxy successfully',
            msg: `Proxying to remote server ${this.proxyServerConfig}`
        });
    }
}

export default ProxyPlugin;
