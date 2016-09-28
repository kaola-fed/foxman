import Application from './application/index';
import ServerPlugin from './plugins/server/';
import WatcherPlugin from './plugins/watcher/';
import PreCompilerPlugin from './plugins/precompiler/';
import ReloadPlugin from './plugins/reloader';
import NeiPlugin from './plugins/nei';
import ProxyPlugin from './plugins/proxy';

let owner;
class Owner {
    constructor(config) {
        const app = Application();
        /**
         * 設置全局的配置信息 
         */
        app.setConfig(config);
        /**
         * 內置的服務，全局共享
         */
        app.use(new WatcherPlugin(config.watch));

        app.use(new ServerPlugin(config.server));

        app.use(new PreCompilerPlugin({
            preCompilers: config.preCompilers
        }));

        if (!!config.nei) {
            app.use(new NeiPlugin(config.nei));
        }

        /**
         * __load ex Plugins
         */
        app.use(config.plugins);

        app.use(new ReloadPlugin({}));

        app.use(new ProxyPlugin({
            proxy: config.proxy,
            proxyServer: config.argv.proxy
        }));

        app.run();
    }
}

module.exports = function (config) {
    if (!owner) owner = new Owner(config);
    return owner;
};
