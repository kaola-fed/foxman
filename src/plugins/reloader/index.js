import {
    util
} from '../../helper';

import Reloader from './reloader';
import path from 'path';
// import globule from 'globule';

/**
 * 监听插件
 */
class ReloadPlugin  {
    constructor(options){
      this.options = options;
    }
    init() {
      let server = this.app.server;
      server.appendHtml("<script src='/resource/js/reload.js'></script>");

      this.reloader = new Reloader( Object.assign({
        watcher: this.app.watcher,
        server: this.app.server
      },this.options) );
    }
}

export default ReloadPlugin;
