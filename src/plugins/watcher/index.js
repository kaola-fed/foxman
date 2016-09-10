import { util } from '../../helper';
import Watcher from './watcher';
import chokidar from 'chokidar';

/**
 * 监听插件
 */
class WatcherPlugin {
    constructor(options) {
        this.options = options;
        this.root = options.root;
    }
    init() {
        this.app.watcher = new Watcher(this.root);
    }
}
export default WatcherPlugin;
