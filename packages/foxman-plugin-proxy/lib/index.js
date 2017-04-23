const { logger, system, consts } = require('@foxman/helpers');
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

    constructor({ proxyServerName = '', proxyConfig = {} }) {
        this.$options = {};
        this.$options.enable = !!proxyServerName;
        const service = proxyConfig.service || {};

        if (this.$options.enable) {
            if (!proxyConfig.host) {
                logger.error('To configure config proxy.host');
                system.exit();
            }

            if (!~Object.keys(service).indexOf(proxyServerName)) {
                logger.error(
                    'To check config, and input correct proxyServer name'
                );
                system.exit();
            }
        }
        Object.assign(this, {
            proxyServerName,
            proxyConfig
        });
    }

    init({ service }) {
        const use = service('server.use');

        this._registerProxy({
            proxyConfig: this.proxyConfig,
            proxyServerName: this.proxyServerName,
            use,
            proxy: this._createProxyServer()
        });
    }

    _createProxyServer() {
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

    _registerProxy({ use, proxy, proxyConfig, proxyServerName }) {
        const service = proxyConfig.service[proxyServerName];

        use(
            () =>
                function*(next) {
                    const dispatcher = this.dispatcher || {};
                    const router = dispatcher.router || false;
                    const type = dispatcher.type;

                    if (type === consts.DIR || !router) {
                        return yield next;
                    }

                    dispatcher.handler = ctx =>
                        doProxy.call(ctx, { proxy, service });

                    yield next;
                }
        );

        logger.success(`Proxying to remote server ${proxyServerName}`);
    }
}

module.exports = ProxyPlugin;
