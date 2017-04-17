const chokidar = require('chokidar');

// Watcher Plugin
class WatcherPlugin {
    name() {
        return 'Watcher';
    }
    
    constructor({enable = true} = {}) {
        this.$options = {
            enable
        };
        this.watcherStore = [];
    }

    stop() {
        this.watcherStore.forEach(watcher => {
            watcher.close();
        });
    }

    createWatcher({
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

        this.watcherStore.push(watcher);
        return watcher;
    }

    service() {
        return {
            createWatcher(...args) {
                return this.createWatcher(...args);
            }
        };
    }
}

module.exports = WatcherPlugin;
