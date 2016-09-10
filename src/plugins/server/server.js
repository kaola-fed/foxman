import Koa from 'koa';
import path from 'path';
import serve from 'koa-serve';
import renderUtil from '../../helper/render';
import render from 'koa-ejs';
import dispatcher from './dispatcher';
import routeMap from './routemap'
import { util , genRouteMap} from '../../helper';

class Server {
    constructor(config) {

        const app = this.app = Koa();
        Object.assign( this, config );

        this.setRender();
        this.setStaticHandler();

        app.use( routeMap( this ) );
        app.use( dispatcher( this ) );
    }

    setRender() {
        Object.assign(this, this.tpl);
        this.renderUtil = this.renderUtil || renderUtil;
        this.renderUtil({ viewFolder: this.viewRoot });

        render(this.app, {
            root: path.join(global.__rootdir, 'views'),
            layout: 'template',
            viewExt: 'html',
            cache: process.env.NODE_ENV !== "development",
            debug: true
        });
    }

    setStaticHandler(staticDirs = []) {
        let rootdir;
        let dir;
        staticDirs.forEach((item) => {
            dir = /[^(\\||\/)]*$/ig.exec(item);
            if (!dir || !dir[0]) return;
            rootdir = item.replace(dir[0], '');
            this.app.use(serve(dir[0], rootdir));
        });

        this.app.use( serve('resource', __dirname) );
    }
    createServer() {
        const port = this.port || 3000;
        this.app.listen( port );
        util.log(`server is running on port ${port}~ `);
    }
}

export default Server;
