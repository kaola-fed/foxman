const Server = require('./Server');
const path = require('path');
const { RenderUtil } = require('../../helper');
const formatStaticOptions = require('./utils/formatStaticOptions');

class ServerPlugin {
    constructor(opts = {}) {
        // TODO: 需要deepClone
        const options = Object.assign({}, opts);
        const statics = options.static ? ensureArray(options.static) : [];

        options.statics = statics
            .filter(item => !!item)
            .map(formatStaticOptions);

        options.runtimeRouters = { routers: options.routers || [] };

        delete options.routers;

        options.syncDataMatch = options.syncDataMatch ||
            (url => path.join(options.syncData, url));

        options.asyncDataMatch = options.asyncDataMatch ||
            (url => path.join(options.asyncData, url));

        options.divideMethod = Boolean(options.divideMethod);

        options.extension = options.extension
            ? String(options.extension)
            : 'ftl';

        options.Render = options.Render || RenderUtil;

        this.options = options;
    }

    init(proxyPlugin) {
        /**
         * 需要 proxyPlugin 来帮助确认是否代理，不代理则开启 bodyParser
         * @type {Server}
         */
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
        this.server.createServer();
    }
}

function ensureArray(target) {
    if (Array.isArray(target)) {
        return target;
    }

    return [target];
}

module.exports = ServerPlugin;
