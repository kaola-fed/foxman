const Server = require('./Server');
const path = require('path');
const { Renderer, util: _ } = require('@foxman/helpers');
const formatStaticOptions = require('./utils/formatStaticOptions');
const checkServerConfig = require('./utils/checkServerConfig');

class ServerPlugin {
    name() {
        return 'server';
    }

    service() {
        return {
            injectScript({ condition, src }) {
                if (!this.server) {
                    return;
                }

                return this.server.injectScript({ condition, src });
            },
            eval(code) {
                if (!this.server) {
                    return;
                }

                return this.server.eval(code);
            },
            evalAlways(code) {
                if (!this.server) {
                    return;
                }

                return this.server.evalAlways(code);
            },
            use(middleware) {
                if (!this.server) {
                    return;
                }

                return this.server.use(middleware);
            },
            broadcast(...args) {
                if (!this.server || !this.server.wss) {
                    return;
                }

                return this.server.wss.broadcast(...args);
            }
        };
    }

    constructor(opts = {}) {
        const result = checkServerConfig(opts);
        if (result) {
            _.errorLog(result);
        }

        // TODO: 需要deepClone
        const options = Object.assign({}, opts);
        const statics = options.static ? _.ensureArray(opts.static) : [];

        options.port = options.port || 3000;

        options.statics = statics
            .filter(item => !!item)
            .map(formatStaticOptions);

        options.runtimeRouters = { routers: options.routers || [] };

        delete options.routers;

        options.syncDataMatch =
            options.syncDataMatch || (url => path.join(options.syncData, url));

        options.asyncDataMatch =
            options.asyncDataMatch ||
            (url => path.join(options.asyncData, url));

        options.divideMethod = Boolean(options.divideMethod);

        options.extension = options.extension
            ? String(options.extension)
            : 'ftl';

        options.Render = options.Render || Renderer;

        this.options = options;
    }

    init(proxyPlugin) {
        this.server = new Server(
            Object.assign(
                {
                    ifProxy: proxyPlugin.enable
                },
                this.options
            )
        );
    }

    runOnSuccess() {
        this.server.start();
    }
}

module.exports = ServerPlugin;
