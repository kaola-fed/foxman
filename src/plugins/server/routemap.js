import { util } from '../../helper';
import path from 'path';

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

    const routeMap = [
      {
        test: '/',
        handler(){
          this.dispatcher = util.dispatcherTypeCreator(
            'dir',
            realTplPath,
            null
          );
        }
      }, {
        test: `.${config.extension}`,
        handler(){
          this.dispatcher = util.dispatcherTypeCreator(
            'sync',
            tplPath,
            commonSync
          );
        }
      }, {
        test: '.json',
        handler(){
          this.dispatcher = util.dispatcherTypeCreator(
            'async',
            commonAsync,
            commonAsync
          );
        }
      }
    ];

    if( requestPath =='/' ){
      requestPath = '/index.html';
    }

    /**
     * 路径统一绝对路径
     */
    const realTplPath = path.join(config.viewRoot, this.request.path);
    const tplPath = path.join(config.viewRoot, requestPath);
    const commonSync = config.syncDataMatch( requestPath.replace(/^(\/||\\)/,'').replace(/\.[^.]*$/, '') ); // arg[0] = viewName;
    const commonAsync = config.asyncDataMatch( util.jsonPathResolve( requestPath ));

    /**
     * mode 1 拦截文件夹的路径
     */
    if( (this.request.query.mode == 1) && this.request.path.endsWith('/') ) {
      util.log('文件夹类型');
      routeMap[0].handler.call(this);
      return yield next;
    }

    /**

    */
    for (let i = 0; i < routers.length; i++) {
      const router = routers[i];

      if( router.method.toUpperCase() == method.toUpperCase() &&
          router.url == this.request.path ){
          const fileWithoutExt = util.removeSuffix( router.filePath );
          /**
           * 同步接口
           * 可能插件会生成一个 syncData ,若已生成则用插件的
           * 即: 插件对于响应,有更高的权限
           */
          if( router.sync ){
            this.dispatcher = util.dispatcherTypeCreator(
              'sync',
              path.join( config.viewRoot, `${fileWithoutExt}.${config.extension}`),
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
          util.log(`请求url:${router.url}`);
          return yield next;
      }
    }

    /**
     * ② 未拦截到 router
     */
    for( let route of routeMap) {
      if( requestPath.endsWith(route.test) ){
        route.handler.call(this);
        return yield next;
      }
    }
  }
}
