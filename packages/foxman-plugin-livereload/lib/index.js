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

    init({ service, getter }) {
        const injectScript = service('server.injectScript');
        const broadcast = service('server.broadcast');
        const watch = service('watch.watch');
        const serverOptions = getter('server');

        injectScript({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        this.reloader = new Reloader({ broadcast, watch, serverOptions });
    }
}

module.exports = LivereloadPlugin;
