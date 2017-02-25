import Server from './server';
import {util} from './../../helper';
import schema from 'validate';

class ServerPlugin {
    constructor(options) {
        ((msg) => {
            if (msg.length > 0) {
                util.error(msg[0].toString());
            }
        })(schema({
            port: {
                type: 'number',
                required: true,
                message: 'server.port must be number'
            },
            viewRoot: {
                type: 'string',
                required: true,
                message: 'server.viewRoot must be string'
            },
            syncData: {
                type: 'string',
                required: true,
                message: 'server.syncData must be string'
            },
            asyncData: {
                type: 'string',
                required: true,
                message: 'server.asyncData must be string'
            }
        }).validate(Object.assign({}, options)));

        options.static = options.static || [];

        this.options = options;
    }

    init(proxyPlugin) {
        /**
         * 需要 proxyPlugin 来帮助确认是否代理，不代理则开启 bodyParser
         * @type {Server}
         */
        this.server = new Server(Object.assign(this.options, {
            ifProxy: proxyPlugin.enable
        }));
    }

    runOnSuccess() {
        this.server.createServer();
    }
}
export default ServerPlugin;
