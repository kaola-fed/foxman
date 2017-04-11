const Reloader = require('./reloader');

class LivereloadPlugin {
    constructor(options) {
        this.options = options || {};
    }

    init(watcherPlugin, serverPlugin) {
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        server.appendHtml({
            condition: () => true,
            html: `<script src='/__FOXMAN__CLIENT__/js/reload.js'></script>`
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
