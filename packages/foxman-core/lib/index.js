const app = require('./application');
const Proxy = require('@foxman/plugin-proxy');
const Livereload = require('@foxman/plugin-livereload');
const Processor = require('@foxman/plugin-processor');
const Watch = require('@foxman/plugin-watch');
const Server = require('@foxman/plugin-server');
const VconsolePlugin = require('@foxman/plugin-vconsole');

module.exports = config => {
    app.use(new Watch(config.watch));

    app.use(new Server(config.server));

    app.use(new Livereload());

    app.use(
        new Processor({
            processors: config.processors
        })
    );

    if (config.nei) {
        const NEISyncPlugin = require('@foxman/plugin-nei');
        app.use(
            new NEISyncPlugin(
                Object.assign(config.nei, {
                    update: config.argv.update
                })
            )
        );
    }

    app.use(config.plugins);

    app.use(new VconsolePlugin());

    app.use(
        new Proxy({
            proxyConfig: config.proxy,
            proxyServerName: config.argv.proxy
        })
    );

    app.run();
};
