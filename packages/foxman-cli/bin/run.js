const Core = require('@foxman/core');
const Proxy = require('@foxman/plugin-proxy');
const Livereload = require('@foxman/plugin-livereload');
const Processor = require('@foxman/plugin-processor');
const Watcher = require('@foxman/plugin-watcher');
const Server = require('@foxman/plugin-server');

module.exports = config => {
    const core = new Core();

    core.use(new Watcher(config.watch));

    core.use(new Server(config.server));

    core.use(new Livereload());

    core.use(
        new Processor({
            processors: config.processors
        })
    );

    if (config.nei) {
        const NEIPlugin = require('@foxman/plugin-nei');
        core.use(
            new NEIPlugin(
                Object.assign(config.nei, {
                    update: config.argv.update
                })
            )
        );
    }

    // Outer Plugins
    core.use(config.plugins);

    if (config.vconsole) {
        const VconsolePlugin = require('@foxman/plugin-vconsole');
        core.use(new VconsolePlugin());
    }

    core.use(
        new Proxy({
            proxyConfig: config.proxy,
            proxyServerName: config.argv.proxy
        })
    );

    core.start();
};
