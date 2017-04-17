const path = require('path');

const {template, resources, syncData} = require('./utils/getReloadPattern');

class Reloader {
    constructor({
        livereload, createWatcher, serverOptions
    }) {
        this.notifyReload = (url) => livereload({
            type: 'livereload',
            payload: url
        });
        this.watcher = options => createWatcher(options);

        this.watch(serverOptions);
    }

    watch({
        extension,
        viewRoot,
        templatePaths,
        syncData: syncDataRoot,
        statics
    } = {}) {
        const templatePattern = template({ extension, viewRoot, templatePaths });
        const resourcesPattern = resources(statics);
        const syncDataPattern = syncData(syncDataRoot);
        const watchPatterns = templatePattern.concat(syncDataPattern).concat(resourcesPattern);

        this.watcher({
            files: watchPatterns
        }).on('change', filepath => 
            this.notifyReload(path.basename(filepath))
        ); 
    }
}

module.exports = Reloader;
