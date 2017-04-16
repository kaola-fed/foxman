const Watcher = require('./Watcher');

/**
 * 监听插件
 */
class WatcherPlugin {
    get name() {
        return 'watch';
    }

    constructor({ root = process.cwd(), enable = true } = {}) {
        this.root = root;
        this.enable = enable;
    }

    init() {
        this.watcher = new Watcher(this.root);
    }
}
module.exports = WatcherPlugin;
