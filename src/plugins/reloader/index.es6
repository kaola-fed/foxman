import Reloader from './reloader';

/**
 * 监听插件
 */
class ReloaderPlugin {
    constructor(options) {
        this.options = options;
    }
    init(watcherPlugin, serverPlugin) {
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        server.appendHtml("<script src='/foxman_client/js/reload.js'></script>");

        this.reloader = new Reloader(Object.assign({
            watcher, server
        }, this.options));
    }
}
export default ReloaderPlugin;
