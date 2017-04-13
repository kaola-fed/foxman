const http = require('http');
const fs = require('fs');
const http2 = require('http2');
const path = require('path');

const Koa = require('koa');
const WebSocket = require('ws');
const bodyParser = require('koa-bodyparser');

const {util} = require('@foxman/helpers');
const dispatcher = require('./middleware/dispatcher');
const routerMap = require('./middleware/routermap');
const setStaticHandler = require('./setStaticHandler');
const {setRender, setView} = require('./setRender');
const setHtmlAppender = require('./setHtmlAppender');

const WebSocketServer = WebSocket.Server;

const {notify, values} = util;

class Server {
    constructor(options) {
        this.serverOptions = options;
        this.middlewares = [];
        this.ifAppendHtmls = [];
        this.app = Koa({outputErrors: false});

        const {Render, templatePaths, viewRoot} = options;
        const app = this.app;

        this.tplRender = setRender({
            Render,
            templatePaths,
            viewRoot
        });

        setView({app});
    }

    registerRouterNamespace(name, value = []) {
        return (this.serverOptions.runtimeRouters[name] = value);
    }

    getRuntimeRouters() {
        const runtimeRouters = this.serverOptions.runtimeRouters;
        return values(runtimeRouters).reduce(
            (prev, item) => prev.concat(item),
            []
        );
    }

    updateRuntimeRouters(fn) {
        return fn(this.getRuntimeRouters());
    }

    delayInit() {
        const {app, ifAppendHtmls, tplRender} = this;
        const {ifProxy, statics} = this.serverOptions;

        if (!ifProxy) {
            app.use(bodyParser());
        }

        // {extension, runtimeRouters, divideMethod, viewRoot, syncData, asyncData, syncDataMatch, asyncDataMatch}
        app.use(routerMap(this.serverOptions));

        this.middlewares.forEach(middleware => app.use(middleware));

        app.use(dispatcher({tplRender}));

        setHtmlAppender({app, ifAppendHtmls});

        setStaticHandler({statics, app});
    }

    use(middleware) {
        this.middlewares.push(middleware(this));
    }

    appendHtml(condition) {
        this.ifAppendHtmls.push(condition);
    }

    createServer() {
        this.delayInit();

        const port = this.serverOptions.port || 3000;
        const httpOptions = {
            key: fs.readFileSync(
                path.resolve(__dirname, 'crt', 'localhost.key')
            ),
            cert: fs.readFileSync(
                path.resolve(__dirname, 'crt', 'localhost.crt')
            )
        };
        const callback = this.app.callback();
        const tips = `Server build successfully on ${this.https ? 'https' : 'http'}://127.0.0.1:${port}/`;

        if (this.https) {
            this.serverApp = http2.createServer(httpOptions, callback);
        } else {
            this.serverApp = http.createServer(callback);
        }

        this.serverApp.listen(port);
        this.wss = this.buildWebSocket({
            serverApp: this.serverApp
        });

        util.log(tips);
        notify({
            title: 'Run successfully',
            msg: tips
        });
    }

    buildWebSocket({serverApp}) {
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

module.exports = Server;
