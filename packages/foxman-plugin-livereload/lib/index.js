const Reloader = require('./reloader');
const {
    getTemplatePattern,
    getResourcesPattern,
    getSyncDataPattern
} = require('./patterns');

class LivereloadPlugin {
    name() {
        return 'livereload';
    }

    dependencies() {
        return [ 'server', 'watcher' ];
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

    constructor({
        statics,
        viewRoot,
        syncData,
        extension,
        livereload = true
    }) {
        this.files = getWatchFiles({
            extension,
            viewRoot,
            syncData,
            statics
        });
        
        this.$options = {
            enable: livereload
        };
    }

    init({ service }) {
        const injectScript = service('server.injectScript');
        const livereload = service('server.livereload');
        const createWatcher = service('watcher.create');

        injectScript({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        this.reloader = new Reloader({ livereload, createWatcher });
        this.reloader.watch(this.files);
    }
}

function getWatchFiles(serverOptions = {}) {
    const {
        extension,
        viewRoot,
        templatePaths,
        syncData,
        statics
    } = serverOptions;

    return [
        ...getTemplatePattern({
            extension,
            viewRoot,
            templatePaths
        }),
        getSyncDataPattern(syncData),
        ...getResourcesPattern(statics)
    ];
}

module.exports = LivereloadPlugin;
