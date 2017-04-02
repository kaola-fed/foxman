import http from 'http';
import fs from 'fs';
import http2 from 'http2';
import Koa from 'koa';
import path from 'path';
import dispatcher from './middleware/dispatcher';
import routeMap from './middleware/routemap';
import setStaticHandler from './setStaticHandler';
import {setRender, setView} from './setRender';
import setHtmlAppender from './setHtmlAppender';

import {util} from '../../helper';
import WebSocket from 'ws';
import {Server as WebSocketServer} from 'ws';
import bodyParser from 'koa-bodyparser';

const {notify, values} = util;

class Server {
    constructor(options) {
        this.serverOptions = options;
        this.middleware = [];
        this.ifAppendHtmls = [];
        this.app = Koa({
            outputErrors: false
        });

        const {statics, Render, templatePaths, viewRoot} = options;
        const app = this.app;

        this.tplRender = setRender({
            Render, templatePaths, viewRoot
        });

        setView({
            app
        });

        setStaticHandler({
            statics, app
        })
    }

    registerRouterNamespace(name, value = {}) {
        return this.serverOptions.runtimeRouters[name] = value;
    }

    updateRuntimeRouters(fn) {
        const runtimeRouters = this.serverOptions.runtimeRouters;
        return fn(values(runtimeRouters).reduce((prev, item) => prev.concat(item), []))
    }
    
    delayInit() {
        const {app, ifAppendHtmls, tplRender} = this;
        const {ifProxy} = this.serverOptions;
        
        if (!ifProxy) {
            app.use(bodyParser());
        }

        // {extension, runtimeRouters, divideMethod, viewRoot, syncData, asyncData, syncDataMatch, asyncDataMatch}
        app.use(routeMap(this.serverOptions));

        this.middleware.forEach((g) => {
            app.use(g);
        });
        
        app.use(dispatcher({tplRender}));

        setHtmlAppender({app, ifAppendHtmls})
    }

    use(middleware) {
        this.middleware.push(middleware(this));
    }

    appendHtml(condition) {
        this.ifAppendHtmls.push(condition);
    }

    createServer() {
        const port = this.serverOptions.port || 3000;
        this.delayInit();
        const root = path.resolve(__dirname, '..', '..', '..');
        const httpOptions = {
            key: fs.readFileSync(path.resolve(root, 'config', 'crt', 'localhost.key')),
            cert: fs.readFileSync(path.resolve(root, 'config', 'crt', 'localhost.crt')),
        };
        const callback = this.app.callback();
        const tips = `Server running on ${this.https ? 'https' : 'http'}://127.0.0.1:${port}/`;

        this.serverApp = (this.https ? http2.createServer(httpOptions, callback) : http.createServer(callback)).listen(port);
        this.wss = this.buildWebSocket(this.serverApp);
        util.log(tips);

        notify({
            title: 'Run successfully',
            msg: tips
        })
    }

    buildWebSocket(serverApp) {
        const wss = new WebSocketServer({
            server: serverApp
        });

        wss.on('connection', ws => {
            ws.on('message', message => {
                console.log('received: %s', message);
            });
        });

        wss.broadcast = data => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        };
        return wss;
    }
}

export default Server;
