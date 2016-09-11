import Application from './application/index';
import ServerPlugin from './plugins/server/';
import WatcherPlugin from './plugins/watcher/';
import PreCompilerPlugin from './plugins/precompiler/';
import ReloadPlugin from './plugins/reloader';
import NeiPlugin from './plugins/nei';

import path from 'path';
import {
    Event,
    util
} from './helper';

let owner;
class Owner {
    constructor(config) {
        const app = Application();
        const root = config.root;
        /**
         * __setConfig
         */
        app.setConfig(config);

        /**
         * 内置组件
         */
        app.use( new WatcherPlugin( Object.assign( config.watch, {
            root
        })));

        app.use( new ServerPlugin( Object.assign( config.server, {
            root
        })));

        app.use( new PreCompilerPlugin({
            preCompilers: config.preCompilers,
            root
        })); /** main **/

        app.use( new ReloadPlugin({})); /** reloader **/

        app.use( new NeiPlugin({
            neiConfigRoot: path.resolve( process.cwd(),'nei.11169.4af51152079f243c6dc28ce87908919e','server.config.js' )
        }));
        /**
         * __loadPlugins
         */
        app.use( config.plugins );

        /**
         * __ready
         */
        app.run();

        /** start server **/


        /** start server **/
    }
}

module.exports = function(config) {
    if (!owner) owner = new Owner(config);
    return owner;
}
