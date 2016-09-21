import Watcher from './watcher';

/**
 * 监听插件
 */
class WatcherPlugin {
    constructor(options) {
        this.root = options.root || process.cmd();
    }
    init() {
        this.watcher = new Watcher(this.root);
    }
}
export default WatcherPlugin;
