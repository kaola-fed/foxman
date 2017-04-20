const chokidar = require('chokidar');

class WatcherPlugin {
    name() {
        return 'Watcher';
    }
    
    constructor() {
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
            interval: 300,
            binaryInterval: 300
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
