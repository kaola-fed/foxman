class VconsolePlugin {
    constructor() {}

    init(serverPlugin) {
        serverPlugin.server.injectScript({
            condition: request => request.query.debug == 1,
            src: `/__FOXMAN__CLIENT__/js/vconsole.min.js`
        });
    }
}

module.exports = VconsolePlugin;
