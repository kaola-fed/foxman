import App from './application';
import {
    PreCompiler, Proxy,
    Reloader, Server, Watcher, Debug
} from './plugins';

class ApplicationContext {
    constructor(config) {
        const app = App();
        /**
         * Configs
         */
        app.setConfig(config);

        /**
         * Watcher Plugin
         */
        app.use(new Watcher(config.watch));

        /**
         * Server Plugin
         */
        app.use(new Server(config.server));

        /**
         * PreCompiler Plugin
         */
        app.use(new PreCompiler({
            preCompilers: config.preCompilers
        }));

        /**
         * Nei Plugin
         */
        if (config.nei) {
            const Nei = require('./plugins/nei').default;
            app.use(new Nei(Object.assign(config.nei,{
                update: config.argv.update
            })));
        }

        /**
         * Outer Plugin
         */
        app.use(config.plugins);

        /**
         * Inner Plugin
         */
        app.use(new Reloader({}));

        /**
         * Inner Plugin
         */
        app.use(new Debug({
            debugTool: config.server.debugTool
        }));

        /**
         * Proxy Plugin
         */
        app.use(new Proxy({
            proxyConfig: config.proxy,
            proxyServerConfig: config.argv.proxy
        }));

        app.run();
    }
}

export default config => new ApplicationContext(config);
