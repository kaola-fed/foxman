const Watcher = require('./Watcher');

/**
 * 监听插件
 */
class WatcherPlugin {
    name() {
        return 'watch';
    }

    service() {
        return {
            watch(type, files, fn) {
                if (!this.watcher) {
                    return;
                }

                return this.watcher.addWatch(type, files, fn);
            }
        };
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
