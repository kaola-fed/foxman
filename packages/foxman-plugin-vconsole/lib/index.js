class VconsolePlugin {
    constructor() {}

    init(serverPlugin) {
        serverPlugin.server.appendHtml({
            condition: VconsolePlugin.condition,
            html: VconsolePlugin.getHtml()
        });
    }

    static condition(request) {
        return request.query.debug == 1;
    }

    static getHtml() {
        return '<script src="/__FOXMAN__CLIENT__/js/vconsole.min.js"></script>';
    }
}

module.exports = VconsolePlugin;
