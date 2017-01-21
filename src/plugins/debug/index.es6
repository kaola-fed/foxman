class DebugPlugin {
    constructor(options) {
        if (!options.debugTool
            && (undefined !== options.debugTool)) {
            this.enable = false;
        }
    }

    init(serverPlugin) {
        serverPlugin.server.appendHtml({
            condition: this.condition,
            html: this.getHtml()
        });
    }

    condition (request) {
        return request.query.debug == 1;
    }

    getHtml() {
        return '<script src="/foxman_client/js/vconsole.min.js"></script>'
    }
}
export default DebugPlugin;
