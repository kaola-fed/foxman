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

        proxy,

        argv
    }) => {
    
    const core = new Core();

    core.use(new Watcher(watch));

    
    core.use(new Server({
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
    }));

    core.use(new Livereload());

    core.use(
        new Processor({
            processors
        })
    );
    
    core.use(plugins);

    core.use(new VconsolePlugin());

    core.use(
        new Proxy({
            proxyConfig: proxy,
            proxyServerName: argv.proxy
        })
    );

    core.start();
};
