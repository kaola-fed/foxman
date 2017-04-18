const Reloader = require('./Reloader');
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

    init({ service, getter }) {
        const livereload = service('server.livereload');
        const serverOptions = getter('server');
        const createWatcher = service('watcher.create');
        
        service('server.injectScript')({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        this.reloader = new Reloader({ livereload, createWatcher, serverOptions });
    }
}

module.exports = LivereloadPlugin;
