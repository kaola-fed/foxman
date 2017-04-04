import {util} from '../../helper';
import httpProxy from 'http-proxy';

/**
 * 全局代理插件
 */
class ProxyPlugin {
    constructor({
        proxyServerName = '', proxyConfig = {}
    }) {
        this.enable = (proxyServerName && proxyConfig);
        const {service = {}} = proxyConfig;

        if (this.enable) {
            if (!proxyConfig.host) {
                util.error('To configure config proxy.host');
            }

            if (Object.keys(service).indexOf(proxyServerName) === -1) {
                util.error('To check config, and input correct proxyServer name');
            }
        }
        Object.assign(this, {proxyServerName, proxyConfig});
    }

    init(serverPlugin) {
        const {proxyConfig, proxyServerName} = this;
        this.server = serverPlugin.server;
        this.initProxy();
        this.registerProxy();
    }

    initProxy() {
        const {proxyConfig, proxyServerName} = this;
        const proxy = this.proxy = httpProxy.createProxyServer({});
        proxy.on('proxyReq', proxyReq => {
            proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
            proxyReq.setHeader('Host', this.proxyConfig.host);
        });
        proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });
    }

    registerProxy() {
        const {proxy, proxyConfig, proxyServerName} = this;
        const service = proxyConfig.service[proxyServerName];
        
        this.server.updateRuntimeRouters(routers => 
            routers.map(router => 
                Object.assign(router, {
                    handler: ctx => {
                        handler.call(ctx, {
                            targetHost: proxyConfig.host,
                            proxy,service
                        });
                    }
                })));

        util.notify({
            title: 'Proxy successfully',
            msg: `Proxying to remote server ${proxyServerName}`
        });
    }
}

export default ProxyPlugin;
