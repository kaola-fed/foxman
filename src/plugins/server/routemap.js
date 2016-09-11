import { util } from '../../helper';

/**
 * 全局中间件,会将具体的页面转换成需要的资源
 * 1.同步
 * {
 *  path,syncData
 * }
 * 2.异步
 * {
 *  asyncData
 * }
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export default ( config )=>{

  return function *( next ) {

    /**
     * ① 拦截 router
     * @type {[type]}
     */
    const [routers, method] = [config.routers, this.request.method];
    let requestPath = this.request.path;
    if( requestPath === '/' && this.request.query.mode != 1 ) {
      requestPath = '/index.html';
    }

    const commonSync = config.syncDataMatch( requestPath.replace(/^(\/||\\)/,'').replace(/\.[^.]*$/, '') );
    const commonAsync = util.jsonPathResolve( requestPath );
    console.log(routers);
    for (let i = 0; i < routers.length; i++) {
      const router = routers[i];

      if( router.method.toUpperCase() == method.toUpperCase() &&
          router.url == requestPath ){
          const fileWithoutExt = util.removeSuffix( router.filePath );
          /**
           * 同步接口
           * 可能插件会生成一个 syncData ,若已生成则用插件的
           * 即: 插件对于响应,有更高的权限
           */
          if( router.sync ){

            this.dispatcher = util.dispatcherTypeCreator(
              'sync',
              `${fileWithoutExt}.${config.extension}`,
              router.syncData || commonSync
            );
          } else {
            /**
             * 如果插件已生成了 asyncData 属性,则用插件的
             * 即: 插件对于响应,有更高的权限
             */
            this.dispatcher = util.dispatcherTypeCreator(
              'async',
              commonAsync,
              router.asyncData || commonAsync
            );
          }
          util.log(`请求url:${router.url}`)
          return yield next;
      }
    }
    /**
     * ② 未拦截到 router
     */
    let routeMap = {
      '/'(){
        this.dispatcher = util.dispatcherTypeCreator(
          'dir',
          requestPath,
          null
        );
      },
      [`.${config.extension}`](){
        this.dispatcher = util.dispatcherTypeCreator(
          'sync',
          requestPath,
          commonSync
        );
      },
      '.json'(){
        this.dispatcher = util.dispatcherTypeCreator(
          'async',
          commonAsync,
          commonAsync
        );
      }
    };

    for( let route of Object.keys(routeMap) ) {
      if(requestPath.endsWith(route)){
        routeMap[route].call(this);
        return yield next;
      }
    }
  }
}
