const {util, DispatherTypes} = require( '../../helper' );
const httpProxy = require( 'http-proxy' );
const proxyHandler = require( './proxyHandler' );

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
        const {server} = serverPlugin;

        const proxy = this.initProxy();
        this.registerProxy({
            proxyConfig, proxyServerName,
            server, proxy
        });
    }

    initProxy() {
        const {proxyConfig} = this;
        const proxy = httpProxy.createProxyServer({});

        proxy.on('proxyReq', proxyReq => {
            proxyReq.setHeader('X-Special-Proxy-Header', 'foxman');
            proxyReq.setHeader('Host', proxyConfig.host);
        });

        proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });

        return proxy;
    }

    registerProxy({
        server, proxy, proxyConfig, proxyServerName
    }) {
        const service = proxyConfig.service[proxyServerName];

        server.use(() => function *(next) {
            const {dispatcher = {}} = this;
            const {router = false, type} = dispatcher;

            if (type === DispatherTypes.DIR || (!router)) {
                return yield next;
            }

            dispatcher.handler = ctx => proxyHandler.call(ctx, {
                proxy, service
            });

            yield next;
        });

        util.notify({
            title: 'Proxy successfully',
            msg: `Proxying to remote server ${proxyServerName}`
        });
    }
}

module.exports = ProxyPlugin;
