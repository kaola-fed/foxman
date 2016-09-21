import http from 'http';
import Koa from 'koa';
import path from 'path';
import serve from 'koa-serve';
import RenderUtil from '../../helper/render';
import render from 'koa-ejs';
import dispatcher from './middleware/dispatcher';
import routeMap from './middleware/routemap'
import { util } from '../../helper';

class Server {
    constructor(config) {
        this.app = Koa();
        Object.assign( this, config );
        
        if( !this.syncDataMatch ){
          this.syncDataMatch = ( url ) => path.resolve( this.syncData ,url );
        }

        if( !this.asyncDataMatch ){
          this.asyncDataMatch = ( url ) => path.join( this.asyncData, url );
        }

        this.setRender();
        this.setStaticHandler();
        this.delayInit();
    }


    delayInit(){
      const app = this.app;
      app.use( routeMap( this ) );
      app.use( dispatcher( this ) );
    }
    setRender() {
        if( this.tpl ){
          Object.assign(this, this.tpl);
        }
        let Render = this.RenderUtil || RenderUtil;
        this.extension = this.extension || 'ftl';

        this.tplRender = new Render({ viewRoot: this.viewRoot });

        render(this.app, {
            root: path.resolve(__dirname, '../../../views'),
            layout: 'template',
            viewExt: 'html',
            cache: process.env.NODE_ENV !== "development",
            debug: true
        });
    }

    setStaticHandler() {
        let rootdir;
        let dir;
        if(this.static && !Array.isArray(this.static)) this.static = [ this.static ];

        this.static.forEach((item) => {
            dir = /[^(\\\/)]*$/.exec(item);
            if (!dir || !dir[0]) return;
            rootdir = item.replace(/[^(\\\/)]*$/, '');
            this.app.use( serve(dir[0], rootdir) );
        });
        this.app.use( serve('r_f', path.resolve(__dirname, '../../../')) );
    }

    appendHtml ( html ){
      let extension = this.extension;
      this.app.use(function * ( next ) {
        if( /text\/html/ig.test(this.type) ){
          this.body = this.body + html;
        }
        yield next;
      });
    }

    createServer() {
        const port = this.port || 3000;
        this.serverApp = http.createServer(this.app.callback()).listen(port);
        util.log(`server is running on ${port}`);
    }
}

export default Server;
