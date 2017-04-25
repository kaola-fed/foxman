const { system, consts } = require('@foxman/helpers');
const logger = require('./logger');
const httpProxy = require('http-proxy');
const doProxy = require('./proxy');

class ProxyPlugin {
    name() {
        return 'proxy';
    }

    dependencies() {
        return [ 'server' ];
    }

    service() {
        return {};
    }

    constructor({ proxyName = '', proxies = [] }) {
        this.$options = {};
        this.$options.enable = !!proxyName;
        let proxyConfig;
        if (this.$options.enable) {
            proxyConfig = this._findProxy(proxies, proxyName);
            
            if (!proxyConfig) {
                logger.error(
                    'Please check config, and input correct proxyServer name'
                );
                system.exit();
            }

            if (!proxyConfig.host) {
                logger.error('Please configure proxy.host');
                system.exit();
            }
        }

        Object.assign(this, {
            proxyName,
            proxyConfig
        });
    }

    init({ service }) {
        const use = service('server.use');

        this._registerProxy({
            proxyConfig: this.proxyConfig,
            proxyName: this.proxyName,
            use,
            proxy: this._createProxyClient()
        });
    }

    _createProxyClient() {
        const proxyConfig = this.proxyConfig;
        const proxy = httpProxy.createProxyServer({});

        proxy.on('proxyReq', req => {
            req.setHeader('X-Special-Proxy-Header', 'foxman');
            req.setHeader('Host', proxyConfig.host);
        });

        proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });

        return proxy;
    }

    _registerProxy({ use, proxy, proxyConfig, proxyName }) {
        const {ip, protocol = 'http'} = proxyConfig;

        use(
            () =>
                function*(next) {
                    const dispatcher = this.dispatcher || {};
                    const router = dispatcher.router || false;
                    const type = dispatcher.type;

                    if (type === consts.DIR || !router) {
                        return yield next;
                    }

                    dispatcher.handler = ctx => doProxy.call(ctx, { proxy, ip, protocol });

                    yield next;
                }
        );

        logger.success(`Proxying to remote server ${proxyName}`);
    }

    _findProxy(proxies, proxyName) {
        return proxies.filter(proxy => (proxy.name === proxyName))[0];
    }
}

module.exports = ProxyPlugin;
