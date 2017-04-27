const chokidar = require('chokidar');
const { typer } = require('@foxman/helpers');

class WatcherPlugin {
    name() {
        return 'Watcher';
    }

    constructor() {
        this._watchers = [];
    }

    init() {}

    destroy() {
        this._watchers.forEach(watcher => watcher.close());
    }

    _createWatcher(ref) {
        let { files, options = {} } = ref;
        if (typer.typeOf(ref) !== 'object') {
            files = ref;
        }

        options = Object.assign(
            {
                ignored: /(\.git)|(node_modules)/,
                ignoreInitial: true,
                interval: 300,
                binaryInterval: 300
            },
            options
        );

        const watcher = chokidar.watch(files, options);
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
