const { system } = require('@foxman/helpers');
const logger = require('./logger');
const KoaApiForward = require('koa-api-forward');
const afterProxy = require('./afterProxy');

class ProxyPlugin {
    name() {
        return 'proxy';
    }

    dependencies() {
        return ['server'];
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
        const {host, ip, protocol} = this.proxyConfig;
        
        this._registerProxy({
            use,
            host, hostname: ip,
            proxyName: this.proxyName,
            scheme: protocol
        });
    }


    _registerProxy({ use, host, hostname, proxyName, scheme }) {
        const koaApiForward = new KoaApiForward({host, specialHeader: 'foxman'});
        use(
            () => koaApiForward.middleware({
                hostname, scheme
            })
        );

        use( 
            () => afterProxy()
        );

        logger.success(`Proxying to remote server ${proxyName}`);
    }

    _findProxy(proxies, proxyName) {
        return proxies.filter(proxy => proxy.name === proxyName)[0];
    }
}

module.exports = ProxyPlugin;
