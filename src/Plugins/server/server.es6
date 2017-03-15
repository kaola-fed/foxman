import http from 'http';
import fs from 'fs';
import http2 from 'http2';
import Koa from 'koa';
import path from 'path';
import {RenderUtil} from '../../helper';
import render from 'koa-ejs';
import dispatcher from './middleware/dispatcher';
import routeMap from './middleware/routemap';
import {util} from '../../helper';
import {Server as WebSocketServer} from 'ws';
import bodyParser from 'koa-bodyparser';
import staticCache from 'koa-static-cache';

class Server {
    constructor(config) {
        this.middleware = [];
        this.ifAppendHtmls = [];
        this.app = Koa();

        Object.assign(this, config);

        if (!this.syncDataMatch) {
            this.syncDataMatch = (url) => path.join(this.syncData, url);
        }

        if (!this.asyncDataMatch) {
            this.asyncDataMatch = (url) => path.join(this.asyncData, url);
        }

        if (undefined == this.divideMethod) {
            this.divideMethod = false;
        }

        this.setRender();
        this.setStaticHandler();
    }

    delayInit() {
        const app = this.app;
        if (!this.ifProxy) {
            app.use(bodyParser());
        }
        app.use(routeMap(this));
        this.middleware.forEach((g) => {
            app.use(g);
        });
        app.use(dispatcher(this));

        this.htmlAppender();
    }

    use(middleware) {
        this.middleware.push(middleware(this));
    }

    setRender() {
        if (this.tpl) {
            Object.assign(this, this.tpl);
        }
        let Render = this.RenderUtil || RenderUtil;
        this.extension = this.extension || 'ftl';

        this.tplRender = new Render({viewRoot: this.viewRoot});

        render(this.app, {
            root: path.resolve(__dirname, '../../../views'),
            layout: 'template',
            viewExt: 'html',
            cache: process.env.NODE_ENV !== 'development',
            debug: true
        });
    }

    setStaticHandler() {
        const {app} = this;
        let statics = this.static;
        if (!statics) {
            return false;
        }

        if (!Array.isArray(statics)) {
            statics = [statics];
        }

        const getStaticOption = (options) => {
            const {
                dir,
                prefix,
                gzip = true,
                preload = true,
                filter = file => file.indexOf('node_modules') === -1
            } = options;

            return {
                dir,
                prefix: prefix ? prefix : ('/' + path.parse(dir).base),
                gzip,
                preload,
                filter
            }
        };

        statics.forEach(item => {
            const dir = path.resolve(process.cwd(), item);
            app.use(staticCache(
                getStaticOption({dir})
            ));
        });

        app.use(staticCache(
            getStaticOption({
                dir: path.resolve(__dirname, '../../../client'),
                prefix: '/foxman_client'
            })
        ))
    }

    appendHtml(condition) {
        this.ifAppendHtmls.push(condition);
    }

    htmlAppender() {
        const ifAppendHtmls = this.ifAppendHtmls;
        let html;

        this.app.use(function*(next) {
            if (/text\/html/ig.test(this.type)) {
                html = ifAppendHtmls.map((item) => {
                    return item.condition(this.request) ? item.html : '';
                }).join('');
                this.body = this.body + html;
            }
            yield next;
        });
    }

    createServer() {
        const port = this.port || 3000;
        this.delayInit();
        const root = path.resolve(__dirname, '..', '..', '..');
        const httpOptions = {
            key: fs.readFileSync(path.resolve(root, 'config', 'crt', 'localhost.key')),
            cert: fs.readFileSync(path.resolve(root, 'config', 'crt', 'localhost.crt')),
        };
        const callback = this.app.callback();
        this.serverApp = (this.https ? http2.createServer(httpOptions, callback) : http.createServer(callback)).listen(port);
        this.wss = this.buildWebSocket(this.serverApp);
        util.log(`Server running on ${this.https ? 'https' : 'http'}://127.0.0.1:${port}/`);
    }

    buildWebSocket(serverApp) {
        var wss = new WebSocketServer({
            server: serverApp
        });

        wss.on('connection', ws => {
            ws.on('message', message => {
                console.log('received: %s', message);
            });
        });

        wss.broadcast = data => {
            wss.clients.forEach(client => {
                client.send(data, error => {
                });
            });
        };
        return wss;
    }
}

export default Server;
