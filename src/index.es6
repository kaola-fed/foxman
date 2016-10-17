import App from './application';
import {
    Nei, PreCompiler, Proxy,
    Reloader, Server, Watcher, Debug
} from './plugins';

let appContext;
class AppContext {
    constructor(config) {
        const app = App();
        /**
         * 設置全局的配置信息 
         */
        app.setConfig(config);
        /**
         * 內置的服務，全局共享
         */
        app.use(new Watcher(config.watch));

        app.use(new Server(config.server));

        app.use(new PreCompiler({
            preCompilers: config.preCompilers
        }));

        if (!!config.nei) {
            app.use(new Nei(config.nei));
        }

        app.use(config.plugins);

        app.use(new Reloader({}));
        
        app.use(new Debug({
            debugTool: config.server.debugTool
        }));

        app.use(new Proxy({
            proxy: config.proxy,
            proxyServer: config.argv.proxy
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
