class DebugPlugin {
    constructor(options) {
        this.options = options;
    }
    init(watcherPlugin, serverPlugin) {
        if(!this.options.debugTool 
            && (undefined !== this.options.debugTool)){
            return 0;
        }
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        server.appendHtml("<script src='/foxman_client/js/vconsole.min.js'></script>");
    }
}
export default DebugPlugin;
