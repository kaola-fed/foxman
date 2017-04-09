import {use, run} from './Application';
import {
    Proxy, Processor, Reloader, Server, Watcher, Debug
} from './Plugins';

export default config => {
    // Watcher Plugin
    use(new Watcher(config.watch));

    // Server Plugin
    use(new Server(config.server));

    // Reloader Plugin
    use(new Reloader({}));

    // Processor Plugin
    use(new Processor({
        processors: config.processors
    }));

    // Nei Plugin
    if (config.nei) {
        const Nei = require('./Plugins/NEISync').default;
        use(new Nei(Object.assign(config.nei,{
            update: config.argv.update
        })));
    }

    // Outer Plugin
    use(config.plugins);

    // Debug Plugin
    use(new Debug({
        debugTool: config.server.debugTool
    }));

    // Proxy Plugin
    use(new Proxy({
        proxyConfig: config.proxy,
        proxyServerName: config.argv.proxy
    }));

    run();
};
