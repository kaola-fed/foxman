const Reloader = require('./reloader');

class LivereloadPlugin {
    name() {
        return 'livereload';
    }

    service() {
        return {
            reload(url) {
                if (!this.reloader) {
                    return;
                }

                return this.reloader.notifyReload(url);
            }
        };
    }

    constructor() {}

    init(watcherPlugin, serverPlugin) {
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;

        server.injectScript({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        this.reloader = new Reloader({ watcher, server });
    }
}

module.exports = LivereloadPlugin;
