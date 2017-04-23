const Server = require('./Server');
const path = require('path');
const { parser, logger, typer, system } = require('@foxman/helpers');
const formatStaticOptions = require('./utils/formatStaticOptions');
const checkServerConfig = require('./utils/checkServerConfig');

class ServerPlugin {
    name() {
        return 'server';
    }

    dependencies() {
        return [];
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

            livereload(url) {
                if (!this.server) {
                    return;
                }

                return this.server.livereload(url);
            },

            use(middleware) {
                if (!this.server) {
                    return;
                }

                return this.server.use(middleware);
            },

            serve(prefix, dirname) {
                if (!this.server) {
                    return;
                }

                return this.server.serve(prefix, dirname);
            },

            registerRouterNamespace(...args) {
                if (!this.server) {
                    return;
                }

                return this.server.registerRouterNamespace(...args);
            }
        };
    }

    constructor(opts = {}) {
        const result = checkServerConfig(opts);
        if (result) {
            logger.error(result);
            system.exit();
        }

        // TODO: 需要deepClone
        const options = Object.assign({}, opts);
        const statics = options.static ? typer.ensureArray(opts.static) : [];

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

        options.Render = options.Render || parser.Render;

        this.$options = options;
    }

    init({ getter }) {
        this.server = new Server(
            Object.assign(
                {
                    ifProxy: getter('proxy.enable')
                },
                this.$options
            )
        );
    }

    ready() {
        this.server.start();
    }
}

module.exports = ServerPlugin;
