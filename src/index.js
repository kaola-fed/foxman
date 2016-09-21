import Application from './application/index';
import ServerPlugin from './plugins/server/';
import WatcherPlugin from './plugins/watcher/';
import PreCompilerPlugin from './plugins/precompiler/';
import ReloadPlugin from './plugins/reloader';
import NeiPlugin from './plugins/nei';
import ProxyPlugin from './plugins/proxy';


let owner;
class Owner {
    constructor( config ) {
        const app = Application();
        /**
         * __setConfig
         */
        app.setConfig(config);

        /**
         * 内置组件
         */
        app.use( new WatcherPlugin( Object.assign( config.watch)));

        app.use( new ServerPlugin( config.server ));

        app.use( new PreCompilerPlugin({
            preCompilers: config.preCompilers
        }));

        if( !!config.nei ){
            app.use( new NeiPlugin( {
                key: config.nei.key
            }));
        }

        /**
         * __load ex Plugins
         */
        app.use( config.plugins );

        app.use( new ReloadPlugin({}));

        app.use( new ProxyPlugin({
          proxy: config.server.proxy,
          proxyServer: config.argv.proxy
        }));

        /**
         * __ready
         */
        app.run();
    }
}

module.exports = function(config) {
    if (!owner) owner = new Owner(config);
    return owner;
};
