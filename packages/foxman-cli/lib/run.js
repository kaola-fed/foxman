const Core = require('pluginify');
const Proxy = require('@foxman/plugin-proxy');
const Livereload = require('@foxman/plugin-livereload');
const Processor = require('@foxman/plugin-processor');
const Watcher = require('@foxman/plugin-watcher');
const Server = require('@foxman/plugin-server');
const Vconsole = require('@foxman/plugin-vconsole');
const Static = require('@foxman/plugin-statics');
const { typer } = require('@foxman/helpers');
const Freemarker = require('@foxman/engine-freemarker');

module.exports = ({
    port = 3000,
    secure = false,
    statics = [],
    viewRoot = '',
    routes = [],
    syncData = '',
    asyncData = '',
    engine = Freemarker,
    engineConfig = {},
    processors = [],
    plugins = [],
    nei = '',
    proxy = [],
    argv,
    livereload = true,
    extension = 'ftl',
    openBrowser
}) => {
    if (argv.port) {
        port = parseInt(argv.port);
    }

    if (typeof argv.openBrowser !== undefined) {
        openBrowser = typer.isTrue(argv.openBrowser);
    }

    const core = new Core();

    core.use(new Watcher());
    core.use(
        new Server({
            port,
            secure,
            routes,
            engine,
            engineConfig,
            extension,
            viewRoot,
            syncData,
            asyncData,
            openBrowser
        })
    );

    core.use(
        new Livereload({
            statics,
            extension,
            viewRoot,
            syncData,
            asyncData,
            livereload
        })
    );

    core.use(
        new Processor({
            processors
        })
    );

    if (nei) {
        const NEIPlugin = require('@foxman/plugin-nei');
        core.use(
            new NEIPlugin(
                Object.assign(nei, {
                    update: argv.update
                })
            )
        );
    }

    core.use(plugins);

    core.use(
        new Vconsole()
    );

    core.use(
        new Static({statics})
    );

    core.use(
        new Proxy({
            proxies: proxy,
            proxyName: argv.proxy
        })
    );

    core.start();
};
