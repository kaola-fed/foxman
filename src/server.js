import Koa from 'koa';
import {join} from 'path';
import serve from 'koa-serve';
import renderUtil from './renderUtil';
import render from 'koa-ejs';
import { dirDispatcher, ftlDispatcher, jsonDispatcher } from './dispatcher';
import KoaHandlebars from 'koa-handlebars';

class Server{
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
		this.app.use(KoaHandlebars({
			defaultLayout:"template",
			extension: ["html"],
			cache: process.env.NODE_ENV!=="development",
			layoutsDir: "views",
			viewsDir: "views"
		}))
	}
	
	buildResource(staticDirs = []) {
		let rootdir;
		let dir;
		staticDirs.forEach(function (item) {
			dir = /[^(\\||\/)]*$/ig.exec(item);
			if(!dir || !dir[0]) return ;
			rootdir = item.replace(dir[0],'');
			this.app.use(serve( dir[0] , rootdir ));
		}.bind(this));

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
		console.log(`freemarker-server is run on port ${this.config.port}~ `);
	}
}

module.exports = function (config) {
	new Server( config ).createServer();
};