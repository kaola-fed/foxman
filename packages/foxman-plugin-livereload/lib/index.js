const Reloader = require('./reloader');

class LivereloadPlugin {
    name() {
        return 'livereload';
    }
    service() {
        return {};
    }
    init({service}) {
        service('server.injectScript')({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        const livereload = service('server.livereload');
        const createWatcher = service('watcher.livereload');
        const serverOptions = service('server.$options');

        this.reloader = new Reloader({
            livereload, createWatcher, serverOptions
        });
    }
}

module.exports = LivereloadPlugin;
