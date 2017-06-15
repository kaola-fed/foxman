const http = require('http');
const fs = require('fs');
const http2 = require('http2');
const path = require('path');

const Koa = require('koa');
const WebSocket = require('ws');
const bodyParser = require('koa-bodyparser');

const { typer, system, string } = require('@foxman/helpers');
const logger = require('./logger');

const routerMiddleware = require('./dispatchers/router');
const resourcesMiddleware = require('./dispatchers/resource');

const apiInterceptor = require('./interceptors/api');
const pageInterceptor = require('./interceptors/page');
const dirInterceptor = require('./interceptors/dir');
const { configureEjs, configureStatics } = require('./configure');

const WebSocketServer = WebSocket.Server;

const { values } = typer;
const { notify } = system;

class Server {
    constructor(options) {
        this.serverOptions = options;
        this._middlewares = [];
        this._injectedScripts = [];
        this.app = Koa({ outputErrors: false });

        const { Render, viewRoot } = options;
        const app = this.app;

        this.viewEngine = new Render(viewRoot, options.engineConfig);

        configureEjs({ app });
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

    prepare() {
        const { app, _injectedScripts, viewEngine } = this;
        const { ifProxy, viewRoot } = this.serverOptions;

        if (!ifProxy) {
            app.use(bodyParser());
        }

        const {
            extension,
            runtimeRouters,
            syncDataMatch,
            asyncDataMatch
        } = this.serverOptions;

        app.use(
            routerMiddleware({
                runtimeRouters,
                extension,
                viewRoot,
                syncDataMatch,
                asyncDataMatch
            })
        );

        app.use(
            resourcesMiddleware({
                extension,
                viewRoot,
                syncDataMatch
            })
        );
        
        this.serve('__FOXMAN_CLIENT__', path.join(__dirname, 'client'));

        this._middlewares.forEach(middleware => app.use(middleware));

        app.use(pageInterceptor({ viewEngine }));
        app.use(apiInterceptor());
        app.use(dirInterceptor());

        // inject builtin scripts
        app.use(function*(next) {
            if (/text\/html/gi.test(this.type)) {
                this.body =
                    this.body +
                    [
                        '/__FOXMAN_CLIENT__/js/builtin/eventbus.js',
                        '/__FOXMAN_CLIENT__/js/builtin/websocket-connector.js',
                        '/__FOXMAN_CLIENT__/js/builtin/eval.js'
                    ]
                        .map(
                            _script =>
                                `<script type="text/javascript" src="${_script}"></script>`
                        )
                        .join('');
            }
            yield next;
        });

        // inject scripts
        app.use(function*(next) {
            if (/text\/html/gi.test(this.type)) {
                this.body =
                    this.body +
                    _injectedScripts
                        .map(script => {
                            return (script.condition
                                ? script.condition(this.request)
                                : true)
                                ? `<script type="text/javascript" src="${script.src}"></script>`
                                : '';
                        })
                        .join('');
            }
            yield next;
        });
    }

    use(middleware) {
        this._middlewares.push(middleware(this));
    }

    injectScript({ condition, src }) {
        this._injectedScripts.push({ condition, src });
    }

    // only eval for one time
    eval(code) {
        const wss = this.wss;

        if (wss) {
            this.wss.broadcast({
                type: 'eval',
                payload: code
            });
        }
    }

    evalAlways(code) {
        if (!this._waitForSending) {
            this._waitForSending = [];
        }
        this._waitForSending.push({
            type: 'eval',
            payload: code
        });
    }

    livereload(url) {
        const wss = this.wss;

        if (wss) {
            this.wss.broadcast({
                type: 'livereload',
                payload: url
            });
        }
    }

    serve(...args) {
        let statics;
        if (args.length === 1 && Array.isArray(args[0])) {
            statics = args[0];
        } else {
            const [prefix, dirname, maxAge = 31536000] = args;
            statics = [{
                prefix: string.ensureLeadingSlash(prefix),
                dir: dirname,
                maxAge
            }];
        }

        configureStatics({
            statics,
            app: this.app
        });
    }

    start() {
        this.prepare();
        const { port, secure } = this.serverOptions;
        const callback = this.app.callback();

        if (secure) {
            this.serverApp = http2.createServer(
                {
                    key: fs.readFileSync(
                        path.resolve(__dirname, 'certificate', 'localhost.key')
                    ),
                    cert: fs.readFileSync(
                        path.resolve(__dirname, 'certificate', 'localhost.crt')
                    )
                },
                callback
            );
        } else {
            this.serverApp = http.createServer(callback);
        }

        this.serverApp.listen(port, () => {
            const tips = `Server build successfully on ${this.https ? 'https' : 'http'}://127.0.0.1:${port}/`;
            logger.newline();
            logger.say(tips);
            notify({
                title: 'Run successfully',
                msg: tips
            });

            this.wss = buildWebSocket(this.serverApp);
            this.wss.on('connection', ws => {
                ws.on('message', message => {
                    logger.info('received: %s', message);
                });

                const waitForSending = this._waitForSending;
                if (!waitForSending) {
                    return;
                }
                waitForSending.forEach(wfs => {
                    ws.send(JSON.stringify(wfs));
                });
            });
        });
    }
}

function buildWebSocket(server) {
    const wss = new WebSocketServer({
        server: server
    });

    wss.broadcast = data => {
        data = JSON.stringify(data);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    return wss;
}

module.exports = Server;
