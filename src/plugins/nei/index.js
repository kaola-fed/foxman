import neiTools from './nei';
import path from 'path';
import fs from 'fs';
import { util,fileUtil } from '../../helper';
import _ from 'util';

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
      const rules = require( this.neiConfigRoot ).routes;
      this.neiRoute = path.resolve(this.app.config.root, 'nei.route.js');
      const routes = require(this.neiRoute);
      this.updateRoutes(routes);
      return;

      // neiTools.update().then((config) => {
        // const routes = this.formatRoutes( rules );
        // this.updateLocalFiles( routes ).then((routes) => {
          // this.updateRoutes(routes);
        // });
      // });
    }

    initRules(){

    }

    formatRoutes( rules ){
      let server = this.app.server;
      let routes = [];
      let neiRoute = this.neiRoute;

      for( let ruleName in rules ){
        if(rules.hasOwnProperty(ruleName)){
          let filePath,id;
          let rule = rules[ruleName];
          let [method, url] = ruleName.split(' ');

          // nei url 默认都是不带 / ,检查是否又
          url = util.appendHeadBreak( url );

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
      fileUtil.writeFile(neiRoute, `module.exports = ${_.inspect(routes,{maxArrayLength: null})}`, () => {

      })
      return routes;
    }

    updateLocalFiles ( routes = []) {

      let server = this.app.server;

      let [syncData, asyncData] = [server.syncData, server.asyncData];

      const promises = routes.map( ( route ) =>{
        return new Promise( ( resolve, reject ) => {
          let dataPath;
          if( route.sync ) {
              dataPath = server.syncDataMatch( route.filePath );
          } else {
              dataPath = path.resolve( server.asyncData, util.jsonPathResolve( route.filePath ));
          }

          fs.stat( dataPath, ( error, stat ) => {
            /**
             * 文件不存在或者文件内容为空
             */
            if( error ){
                util.log('make empty file: ' + dataPath);
                fileUtil.writeUnExistsFile( dataPath, "" ).then( resolve , reject );
                return 0;
            }
            resolve();
          });
        })
      });
      return new Promise((...args)=>{
        Promise.all( promises ).then(()=>{
          args[0](routes);
        }).catch((e)=>{
          util.error(e);
        });
      });
    }

    updateRoutes( routes ){
      let promises = routes.map( ( route ) => {

        return new Promise((...args) => {

          fs.stat( route.filePath, ( error, stat ) => {
            /**
             * 文件不存在或者文件内容为空
             */
            if( error || !stat.size ){
                // TODO url creater
                if( route.sync ) {
                    route.syncData = 'http://m.kaola.com';
                } else {
                    route.filePath = 'http://m.kaola.com';
                    // dataPath = path.resolve( server.asyncData, util.jsonPathResolve( route.filePath ));
                }
            }
            args[0]();
          });
        })
      });
      Promise.all(promises).then(() => {
        let server = this.app.server;
        server.routers = routes.concat( server.routers );
      });
    }
}

export default NeiPlugin;
