import neiTools from './nei';
import path from 'path';
import fs from 'fs';
import { util,fileUtil } from '../../helper';
import _ from 'util';

/**
 * Nei 插件
 */
class NeiPlugin  {
    constructor(options){
      this.options = options;
      Object.assign(this, options);
    }

    init() {
      const recieveUpdate = (config) => {
        // 更新
        try{
          delete require.cache[require.resolve(this.config)];
        }catch(e){}

        const rules = require( this.config ).routes;
        const routes = this.formatRoutes( rules );
        return this.updateLocalFiles( routes );
      }
      const updateRoutes = (routes) => {
        this.updateRoutes(routes);
      }

      const doUpdate = this.app.config.update;

      let neiConfig, routes;

      this.neiRoute = path.resolve( this.app.config.root, 'nei.route.js');

      try {
        neiConfig = require( this.config );
      } catch ( e ) {
        util.error('nei 配置文件不存在，请先配置项目的nei关联，并核对 config 中的 nei.config是否合法');
      }

      if( doUpdate ) {
        return neiTools.update().then(recieveUpdate).then(updateRoutes);
      }

      try {
        routes = require(this.neiRoute);
      } catch ( e ) {
        util.error('foxman 未找到格式化过的内 nei route，请先执行 foxman -u ');
      }

      return updateRoutes(routes);
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

          // nei url 默认都是不带 / ,检查是否有
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
                const dataPath = this.genNeiApiUrl( route );
                if( route.sync ) {
                    route.syncData = dataPath;
                } else {
                    route.asyncData = dataPath;
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

    genNeiApiUrl ( route ) {
      return path.resolve(route.sync? this.mockTpl: this.mockApi, route.filePath +'.json' );
    }
}

export default NeiPlugin;
