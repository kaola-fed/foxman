const Watcher = require( './Watcher' );

/**
 * 监听插件
 */
class WatcherPlugin {
    constructor(options) {
        this.root = (options && options.root) || process.cwd();
    }

    init() {
        this.watcher = new Watcher(this.root);
    }
}
module.exports = WatcherPlugin;
