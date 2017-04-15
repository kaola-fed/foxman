const Server = require('./Server');
const path = require('path');
const {Renderer} = require('@foxman/helpers');
const formatStaticOptions = require('./utils/formatStaticOptions');
const checkServerConfig = require('./utils/checkServerConfig');

class ServerPlugin {
    constructor(opts = {}) {
        checkServerConfig(opts);

        // TODO: 需要deepClone
        const options = Object.assign({}, opts);
        const statics = options.static ? ensureArray(options.static) : [];

        options.statics = statics
            .filter(item => !!item)
            .map(formatStaticOptions);

        options.runtimeRouters = {routers: options.routers || []};

        delete options.routers;

        options.syncDataMatch = options.syncDataMatch ||
            (url => path.join(options.syncData, url));

        options.asyncDataMatch = options.asyncDataMatch ||
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

function ensureArray(target) {
    if (Array.isArray(target)) {
        return target;
    }

    return [target];
}

module.exports = ServerPlugin;
