import http from 'http';
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
        this.app = Koa();
        Object.assign( this, config );

        this.formatArgs();

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

    formatArgs(){
      ['syncData', 'viewRoot', 'asyncData'].forEach( ( item ) => {
          this[item] = path.resolve(this.root, this[item]);
      });

      this.static.forEach( (item, idx )=>{
        this.static[idx] = path.resolve(this.root, item);
      });
    }

    delayInit(){
      const app = this.app;
      app.use( routeMap( this ) );
      app.use( dispatcher( this ) );
    }
    setRender() {
        if( this.tplConfig ){
          Object.assign(this, this.tplConfig);
        }

        this.renderUtil = this.renderUtil || renderUtil;
        this.extension = this.extension || 'ftl';

        this.renderUtil({ viewFolder: this.viewRoot });

        render(this.app, {
            root: path.join(global.__rootdir, 'views'),
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
        this.app.use( serve('resource', global.__rootdir) );
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
