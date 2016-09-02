import {Event, STATES, BasePlugin} from 'foxman-api';
import Watcher from './watcher';
import chokidar from 'chokidar';
import {error,
				log,
				debugLog,
				warnLog
			} from '../util/util';

/**
 * 监听插件
 */
class WatcherPlugin extends BasePlugin{
  constructor(options){
    super(options);
    this.options = options;
  }
  beforeServerStart(){
    let root = this.config.path.root;
    let app = this.app;
    app.watcher = new Watcher(root);
    /**
     * file watcher api;
     * relative path is root Directory
     */
    app.watcher.onChange('/**/*', function ( path, stats) {
      debugLog(`watcher: filechange, ${path}`);
    });
    setTimeout(()=>{
        this.complete();
    },2000);
  }
}
export default WatcherPlugin;
