import {use, run} from './Application';
import {
    PreCompiler, Proxy, Processor,
    Reloader, Server, Watcher, Debug
} from './Plugins';

class ApplicationContext {
    constructor(config) {
        // Watcher Plugin
        use(new Watcher(config.watch));

        // Server Plugin
        use(new Server(config.server));

        // PreCompiler Plugin
        // use(new PreCompiler({
        //     preCompilers: config.preCompilers
        // }));
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

        // Reloader Plugin
        use(new Reloader({}));

        // Debug Plugin
        use(new Debug({
            debugTool: config.server.debugTool
        }));

        // Proxy Plugin
        use(new Proxy({
            proxyConfig: config.proxy,
            proxyServerConfig: config.argv.proxy
        }));

        run();
    }
}

export default config => {
    return new ApplicationContext(config);
};
