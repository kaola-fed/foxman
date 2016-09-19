import Reloader from './reloader';

/**
 * 监听插件
 */
class ReloadPlugin {
    constructor(options) {
        this.options = options;
    }
    init( watcherPlugin, serverPlugin ) {
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        server.appendHtml("<script src='/resource/js/reload.js'></script>");

        this.reloader = new Reloader(Object.assign({
            watcher, server
        }, this.options));
    }
}

export default ReloadPlugin;
