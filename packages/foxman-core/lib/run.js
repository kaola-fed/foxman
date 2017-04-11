const app = require('./application');
const Proxy = require('@foxman/plugin-proxy');
const Livereload = require('@foxman/plugin-livereload');
const Processor = require('@foxman/plugin-processor');
const Watch = require('@foxman/plugin-watch');
const Server = require('@foxman/plugin-server');

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
        app.use(
            new require('@foxman/plugin-nei')(
                Object.assign(config.nei, {
                    update: config.argv.update
                })
            )
        );
    }

    // Outer Plugins
    app.use(config.plugins);

    if (config.server.debugTool) {
        app.use(new require('@foxman/plugin-vconsole')());
    }

    app.use(
        new Proxy({
            proxyConfig: config.proxy,
            proxyServerName: config.argv.proxy
        })
    );

    app.run();
};
