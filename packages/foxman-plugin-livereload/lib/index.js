const Reloader = require('./reloader');

class LivereloadPlugin {
    constructor(options) {
        this.options = options || {};
    }

    init(watcherPlugin, serverPlugin) {
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        server.injectScript({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        this.reloader = new Reloader(
            Object.assign(
                {
                    watcher,
                    server
                },
                this.options
            )
        );
    }
}
module.exports = LivereloadPlugin;
