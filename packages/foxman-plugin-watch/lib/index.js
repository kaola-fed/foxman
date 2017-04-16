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

    constructor({ root = process.cwd() } = {}) {
        this.$options = {
            root: root,
            enable: true
        };
    }

    init() {
        this.watcher = new Watcher(this.$options.root);
    }
}
module.exports = WatcherPlugin;
