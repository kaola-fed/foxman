const path = require('path');

const {template, resources, syncData} = require('./utils/getReloadPattern');

class Reloader {
    constructor({
        livereload, createWatcher, serverOptions
    }) {
        this.notifyReload = (url) => livereload(url);
        this.watcher = createWatcher();

        this.watch(serverOptions);
    }

    watch({
            extension,
            viewRoot,
            templatePaths,
            syncData: syncDataRoot,
            statics
    }) {
        const templatePattern = template({
            extension,
            viewRoot,
            templatePaths
        });
        const resourcesPattern = resources(statics);
        const syncDataPattern = syncData(syncDataRoot);

        const watchPatterns = templatePattern.concat(syncDataPattern).concat(resourcesPattern);

        this.watcher.watch(watchPatterns).on('change', function (filepath) {
            this.notifyReload(path.basename(filepath));
        });
    }
}

module.exports = Reloader;
