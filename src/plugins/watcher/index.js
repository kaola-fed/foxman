import {
    Event,
    STATES,
    BasePlugin,
    util
} from 'foxman-api';
import Watcher from './watcher';
import chokidar from 'chokidar';

/**
 * 监听插件
 */
class WatcherPlugin extends BasePlugin {
    constructor(options) {
        super(options);
        this.options = options;
        this.root = options.root;
    }
    init() {
        this.watch(this.root);
    }
    watch(root) {
        let app = this.app;
        app.watcher = new Watcher(root);
        /**
         * file watcher api;
         * relative path is root Directory
         */
        // app.watcher.onChange('/**/*', function ( path, stats) {
        //   // debugLog(`watcher: ${path}`);
        // });
    }
}
export default WatcherPlugin;
