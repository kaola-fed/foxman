class DebugPlugin {
    constructor(options) {
        this.options = options;
    }

    init(serverPlugin) {
        if (!this.options.debugTool
            && (undefined !== this.options.debugTool)) {
            return 0;
        }
        const server = serverPlugin.server;
        const debugToolHtml = '<script src="/foxman_client/js/vconsole.min.js"></script>';
        /**
         * 增加debugTool 判断
         */
        server.appendHtml({
            condition: (request) => {
                return request.query.debug == 1;
            },
            html: debugToolHtml
        });
    }
}
export default DebugPlugin;
