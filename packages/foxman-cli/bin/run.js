const Core = require('@foxman/core');
const Proxy = require('@foxman/plugin-proxy');
const Livereload = require('@foxman/plugin-livereload');
const Processor = require('@foxman/plugin-processor');
const Watcher = require('@foxman/plugin-watcher');
const Server = require('@foxman/plugin-server');
const VconsolePlugin = require('@foxman/plugin-vconsole');

module.exports = ({
    extension,
    port,
    secure,
    statics,
    viewRoot,
    routes,
    watch,
    syncData,
    asyncData,
    engine,
    engineConfig,
    processors,
    plugins,
    nei,
    proxy,
    argv,
    livereload
}) => {
    const core = new Core();

    core.use(new Watcher(watch));

    core.use(
        new Server({
            port,
            secure,
            statics,
            routes,
            engine,
            engineConfig,
            extension,
            viewRoot,
            syncData,
            asyncData
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

    core.use(new VconsolePlugin());

    core.use(
        new Proxy({
            proxies: proxy,
            proxyName: argv.proxy
        })
    );

    core.start();
};
