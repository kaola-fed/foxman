import neiTools from './nei';
import path from 'path';
import neiHandle from 'nei/lib/server/nei';

/**
 * 监听插件
 */
class NeiPlugin  {
    constructor(options){
      this.options = options;
    }
    init() {
      neiTools.update().then((config) => {
        let neiConfigRoot = config.neiConfigRoot;
        this.formatRoutes(require(`${neiConfigRoot}/server.config.js`));
      });
    }
    formatRoutes( rules ){
      rules = neiHandle.getRoutes( rules );
      console.log(rules);
      console.log('fine');
    }
}

export default NeiPlugin;
