import Koa from 'koa';
import {join} from 'path';
import serve from 'koa-serve';
import renderUtil from './renderUtil';
import render from 'koa-ejs';
import {
	dirDispatcher,
	ftlDispatcher,
	jsonDispatcher
} from './dispatcher';

class Server{
	constructor(config){
		this.app = Koa();
		
		const _config = Object.assign({},{
			port            : '3000',
			ftlDir          : join(global.__rootdirname, 'test', 'ftl'),
			mockFtlDir      : join(global.__rootdirname, 'test', 'mock','fakeData'),
			mockJsonDir     : join(global.__rootdirname, 'test', 'mock','json'),
			staticParentDir : join(global.__rootdirname, 'test'),
		});

		Object.assign(_config, config);
		Object.assign(this, _config);

		renderUtil({
			viewFolder: this.ftlDir
		});

		this.setRender();
		this.buildResource();
		this.dispatch();
	}

	setRender(){
		render(this.app,{
			root    : join(global.__rootdirname, 'views'),
	  layout  : 'template',
	  viewExt : 'html',
	  cache   : false,
	  debug   : true
		})
	}
	
	buildResource() {
		this.app.use(serve('static', this.staticParentDir));
	}

	dispatch() {
		const context = this;

		this.app.use(function* (){
			const url  = this.req.url;
			const path = join(context.ftlDir, url);
			const routeMap = {
				'/'    : dirDispatcher,
				'.ftl' : ftlDispatcher,
				'.json': jsonDispatcher,
			}

			for (let route of Object.keys(routeMap)){
				if( url.endsWith(route) ){
					yield routeMap[route](url, path, context, this);
					return;
				}
			}

		});
	}
	createServer(){
		this.app.listen(this.port);	
		console.log(`freemarker-server is run on port ${this.port}~ `);
	}
}

module.exports = function (config) {
	new Server( config ).createServer();
}