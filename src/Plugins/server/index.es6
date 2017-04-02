import Server from './Server';
import path from 'path';
import {RenderUtil} from '../../helper';

class ServerPlugin {
    constructor(options) {
        let statics = options.static;
        
        if (undefined === statics) {
            statics = [];
        }
        
        if (!Array.isArray(statics)) {
            statics = [statics];
        }

        options.statics = statics.filter(item => !!item);

        if (undefined === options.routers) {
            options.routers = [];
        }

        options.runtimeRouters = {
            routers: options.routers
        };

        delete options.routers
        

        if (undefined === options.syncDataMatch) {
            options.syncDataMatch = url => path.join(options.syncData, url);
        }

        if (undefined === options.asyncDataMatch) {
            options.asyncDataMatch = url => path.join(options.asyncData, url);
        }

        if (undefined === options.divideMethod) {
            options.divideMethod = false;
        }

        if (undefined === options.extension) {
            options.extension = 'ftl';
        }
        
        if (undefined === options.Render) {
            options.Render = RenderUtil;
        }

        this.options = options;
    }

    init(proxyPlugin) {
        /**
         * 需要 proxyPlugin 来帮助确认是否代理，不代理则开启 bodyParser
         * @type {Server}
         */
        this.server = new Server(Object.assign({
            ifProxy: proxyPlugin.enable
        }, this.options));
    }

    runOnSuccess() {
        this.server.createServer();
    }
}
export default ServerPlugin;
