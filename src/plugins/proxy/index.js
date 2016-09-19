import {
    util
} from '../../helper';
/**
 * 全局代理插件
 */
class ProxyPlugin {
    constructor(options) {
        Object.assign(
            this,
            options
        );
    }
    init( serverPlugin ) {
        /**
         * 命令行选项
         */
        if ( !this.proxyServer ) {
            return false;
        }
        this.server = serverPlugin.server;
        
        if ( Object.keys( this.proxy ).indexOf( this.proxyServer ) == -1) {
            util.error('请核对配置文件，并设置正确的 proxyServerName ');
        }
        this.updateRoutes( this.proxy[this.proxyServer] );
    }
    updateRoutes(resolve) {
        const routes = this.server.routers;

        routes.forEach((router) => {
            const proxyUrl =  router.url.replace(/^(\/)/, '') ;

            if (router.sync) {
                router.syncData = proxyUrl
            } else {
                router.asyncData = proxyUrl;
            }
        });
    }
}

export default ProxyPlugin;
