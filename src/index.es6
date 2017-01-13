import App from './application';
import {
    PreCompiler, Proxy,
    Reloader, Server, Watcher, Debug
} from './plugins';

let appContext;
class AppContext {
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
            import Nei from './plugins/nei';
            app.use(new Nei(config.nei));
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

module.exports = function (config) {
    if (!appContext) {
        appContext = new AppContext(config);
    }
    return appContext;
};
