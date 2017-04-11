const {use, run} = require('./application');
const {
    Processor,
    Server,
    Watcher
} = require('./plugins');
const Proxy = require('@foxman/plugin-proxy');
const VConsole = require('@foxman/plugin-vconsole');
const Livereload = require('@foxman/plugin-livereload');

module.exports = config => {
    use(new Watcher(config.watch));

    use(new Server(config.server));

    use(new Livereload({}));

    use(
        new Processor({
            processors: config.processors
        })
    );

    if (config.nei) {
        const Nei = require('./plugins/NEISync');
        use(
            new Nei(
                Object.assign(config.nei, {
                    update: config.argv.update
                })
            )
        );
    }

    // Outer Plugins
    use(config.plugins);

    if (config.server.debugTool) {
        use(new VConsole());
    }

    use(
        new Proxy({
            proxyConfig: config.proxy,
            proxyServerName: config.argv.proxy
        })
    );

    run();
};
