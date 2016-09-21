import {util, fileUtil} from "../../helper";
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

    init(serverPlugin) {

        /**
         * 命令行选项
         */
        if (!this.proxyServer) {
            return false;
        }
        this.server = serverPlugin.server;
        const proxy = this.proxy;

        proxy.service = proxy.service || {};

        if (Object.keys(proxy.service).indexOf(this.proxyServer) == -1) {
            util.error('请核对配置文件，并设置正确的代理服务别名');
        }

        this.updateRoutes(proxy.service[this.proxyServer]);
    }

    updateRoutes(service) {
        const routes = this.server.routers;
        const host = this.proxy.host;
        routes.forEach((router) => {
            router.handler = (ctx) => {
                return handler.call(ctx);
            };
        });
        util.log("代理已生效");

        function handler() {
            const url = service(this.request.url.replace(/^(\/)/, ''));
            let headers = Object.assign({}, this.request.headers);
            delete headers['accept-encoding'];
            if (host) {
                headers.host = host;
            }
            return fileUtil.jsonResolver({
                url,
                headers
            }).then((res) => {
                this.status = res.statusCode;
                for (let name in res.headers) {
                    if (res.headers.hasOwnProperty(name)) {
                        this.set(name, res.headers[name]);
                    }
                }
                return new Promise((resolve) => {
                    resolve(res);
                });
            });
        }
    }
}

export default ProxyPlugin;
