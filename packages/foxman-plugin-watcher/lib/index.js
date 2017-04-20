const chokidar = require('chokidar');

// Watcher Plugin
class WatcherPlugin {
    name() {
        return 'Watcher';
    }
    
    constructor(options = {}) {
        this.$options = {
            enable: typeof options.enable !== 'undefined' ? options.enable : true
        };
        this._watchers = [];
    }

    destroy() {
        this._watchers.forEach(watcher => watcher.close());
    }

    _createWatcher({
        files, 
        options = {}
    } = {}) {
        const watcher = chokidar.watch(files, Object.assign({
            ignored: /(\.git)|(node_modules)/,
            ignoreInitial: true,

            ersistent: true,
            followSymlinks: true,
            cwd: process.cwd(),
            
            alwaysStat: false,
            depth: 99,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            },

            ignorePermissionErrors: false,
            atomic: true 
        }, options));

        this._watchers.push(watcher);
        return watcher;
    }

    service() {
        return {
            create(...args) {
                return this._createWatcher(...args);
            }
        };
    }
}

module.exports = WatcherPlugin;
