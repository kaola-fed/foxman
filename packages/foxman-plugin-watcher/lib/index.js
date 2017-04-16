const chokidar = require('chokidar');

/**
 * 监听插件
 */
class WatcherPlugin {
    get name() {
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
        options
    }) {
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
            atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
        }, options));

        this.watcherStore.push(watcher);

        return watcher;
    }

    service() {
        return {
            createWatcher({
                files, 
                options = {}
            }) {
                return this.createWatcher({
                    files, options
                });
            }
        };
    }
}

module.exports = WatcherPlugin;
