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
const configureStatics = require('./configureStatics');
const {configureViewEngine, configureEjs} = require('./configureViewEngine');

const WebSocketServer = WebSocket.Server;

const {notify, values} = util;

class Server {
    constructor(options) {
        this.serverOptions = options;
        this._middlewares = [];
        this._injectedScripts = [];
        this.app = Koa({outputErrors: false});

        const {Render, templatePaths, viewRoot} = options;
        const app = this.app;

        this.viewEngine = configureViewEngine({
            Render,
            templatePaths,
            viewRoot
        });

        configureEjs({app});
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
        const {app, _injectedScripts, viewEngine} = this;
        const {ifProxy, statics} = this.serverOptions;

        if (!ifProxy) {
            app.use(bodyParser());
        }

        // {extension, runtimeRouters, divideMethod, viewRoot, syncData, asyncData, syncDataMatch, asyncDataMatch}
        app.use(routerMap(this.serverOptions));

        this._middlewares.forEach(middleware => app.use(middleware));

        app.use(dispatcher({viewEngine}));

        // inject scripts
        app.use(function*(next) {
            if (/text\/html/ig.test(this.type)) {
                this.body = this.body +
                    _injectedScripts
                        .map(script => {
                            return script.condition(this.request)
                                ? `<script type="text/javascript" src="${script.src}"></script>`
                                : '';
                        })
                        .join('');
            }
            yield next;
        });

        configureStatics({statics, app});
    }

    use(middleware) {
        this._middlewares.push(middleware(this));
    }

    injectScript({condition, src}) {
        this._injectedScripts.push({condition, src});
    }

    start() {
        this.delayInit();
        const callback = this.app.callback();
        const {port, https} = this.serverOptions;
        const tips = `Server build successfully on ${https ? 'https' : 'http'}://127.0.0.1:${port}/`;

        if (https) {
            const httpOptions = {
                key: fs.readFileSync(
                    path.resolve(__dirname, 'crt', 'localhost.key')
                ),
                cert: fs.readFileSync(
                    path.resolve(__dirname, 'crt', 'localhost.crt')
                )
            };
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
