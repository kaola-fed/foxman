const Reloader = require('./Reloader');
const {
    getTemplatePattern,
    getResourcesPattern,
    getSyncDataPattern
} = require('./patterns');

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
        const livereload = service('server.livereload');
        const createWatcher = service('watcher.create');
        const serverOptions = getter('server');

        injectScript({
            condition: () => true,
            src: `/__FOXMAN__CLIENT__/js/reload.js`
        });

        const files = getWatchFiles(serverOptions);
        this.reloader = new Reloader({ livereload, createWatcher });
        this.reloader.watch(files);
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
        ...getSyncDataPattern(syncData),
        ...getResourcesPattern(statics)
    ];
}

module.exports = LivereloadPlugin;
