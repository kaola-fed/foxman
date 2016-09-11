import neiTools from './nei';
import path from 'path';
import fs from 'fs';
import { util,fileUtil } from '../../helper';


// import neiHandle from 'nei/lib/server/nei';

/**
 * 监听插件
 */
class NeiPlugin  {
    constructor(options){
      this.options = options;
      Object.assign(this, options);
    }
    init() {
      this.updateLocalFiles( this.formatRoutes( require( this.neiConfigRoot ).routes ) );
      return ;

      neiTools.update().then((config) => {
        this.formatRoutes(require(this.neiConfigRoot).routes);
      });
    }
    formatRoutes( rules ){
      let routes = [];
      for( let ruleName in rules ){
        if(rules.hasOwnProperty(ruleName)){
          let filePath,id;
          let rule = rules[ruleName];

          let [method, url] = ruleName.split(' ');
          let sync = rule.hasOwnProperty('list');

          if( sync ){
            [filePath,id] = [rule.list[0].path, rule.list[0].id];
          } else {
            [filePath,id] = [rule.path,rule.id];
          }

          routes.push({
            method, url,
            sync, filePath, id
          });
        }
      }

      return routes;
    }
    updateLocalFiles ( routes = []) {
      let [server] = [this.app.server];

      let [syncData, asyncData] = [server.syncData, server.asyncData];

      return routes.forEach( ( route ) => {
        let dataPath;
        if( route.sync ) {
            dataPath = server.syncDataMatch(route.filePath);
        } else {
            dataPath = path.resolve( server.asyncData, util.jsonPathResolve( route.filePath ));
        }
        fs.stat( dataPath, (error, stat) => {
          if(error) {
            util.log('make empty file: '+dataPath);
            fileUtil.writeUnExistsFile(dataPath,"");
          }
        });
      });
    }
}

export default NeiPlugin;
