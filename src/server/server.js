import Koa from 'koa';
import {join} from 'path';
import serve from 'koa-serve';
import renderUtil from '../util/renderUtil';
import render from 'koa-ejs';
import { dirDispatcher, ftlDispatcher, jsonDispatcher } from './dispatcher';
import {error, log} from '../util/util';

class Server {
	constructor(config){
		this.app = Koa();
		this.config = config;

		renderUtil({
			viewFolder: config.path.root
		});

		this.buildResource(config.path.static);
		this.setRender();
		this.dispatch();
	}

	setRender(){
		render(this.app,{
			root: join(global.__rootdir, 'views'),
		  layout: 'template',
		  viewExt: 'html',
		  cache: process.env.NODE_ENV!=="development",
		  debug: true
		});
	}

	buildResource(staticDirs = []) {
		let rootdir;
		let dir;
		staticDirs.forEach( (item) => {
			dir = /[^(\\||\/)]*$/ig.exec(item);
			if(!dir || !dir[0]) return ;
			rootdir = item.replace(dir[0],'');
			this.app.use(serve( dir[0] , rootdir ));
		});

		this.app.use(serve('resource',__dirname));
	}

	dispatch() {
		const context = this;

		this.app.use(function* (){
			const url  = this.req.url;
			const routeMap = {
				'/'    : dirDispatcher,
				'.ftl' : ftlDispatcher,
				'.json': jsonDispatcher
			};

			for (let route of Object.keys(routeMap)){
				if( url.endsWith(route) ){
					yield routeMap[route](url, context.config, this);
					return;
				}
			}
		});
	}
	createServer(){
		this.config.port = this.config.port || 3000;
		this.app.listen(this.config.port);
		log(`freemarker-server is run on port ${this.config.port}~ `);
	}
}

export default Server;
// (config) => {
// 	new Server( config ).createServer();
// };
