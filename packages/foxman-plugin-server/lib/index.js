const Server = require('./Server');
const path = require('path');
const { typer, system } = require('@foxman/helpers');
const Freemarker = require('@foxman/engine-freemarker');
const logger = require('./logger');
const { typeOf } = typer;

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
            },
            getRuntimeRouters(...args) {
                if (!this.server) {
                    return;
                }

                return this.server.getRuntimeRouters(...args);
            }
        };
    }

    constructor(opts) {
        let {
            port = 3000,
            secure,
            statics = [],
            routes = [],
            engine,
            engineConfig = {},
            extension = 'ftl',
            viewRoot,
            syncData,
            asyncData
        } = opts;
        const result = checkConfig(opts);
        if (result) {
            logger.error(result);
            system.exit();
        }

        statics = typer.ensureArray(statics).filter(item => !!item);

        const runtimeRouters = { routers: routes };

        const syncDataMatch = url => path.join(syncData, url);

        const asyncDataMatch = url => path.join(asyncData, url);

        const Render = engine || Freemarker;
        this.$options = {
            runtimeRouters,

            extension,
            Render,
            port,
            secure,

            viewRoot,
            syncData,
            asyncData,
            statics,

            engineConfig,
            syncDataMatch,
            asyncDataMatch
        };
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

function checkConfig({ syncData, asyncData }) {
    if (typeOf(syncData) !== 'string') {
        return 'config.syncData must be string';
    }

    if (typeOf(asyncData) !== 'string') {
        return 'config.asyncData must be string';
    }
}

module.exports = ServerPlugin;
module.exports.checkConfig = checkConfig;
