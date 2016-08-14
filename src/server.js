import Koa from 'koa';
import {join} from 'path';
import serve from 'koa-serve';
import fileUtil from './fileUtil';
import renderUtil from './renderUtil';
import render from 'koa-ejs';

class Server{
	constructor(config){
		this.app = Koa();
		
		this.staticParentDir  = config.staticDir || join(global.__rootdirname, 'test');
		this.ftlDir     = config.staticDir || join(global.__rootdirname, 'test', 'ftl');
		this.mockFtlDir = config.staticDir || join(global.__rootdirname, 'test', 'mock','fakeData');
		this.mockJsonDir= config.staticDir ||  join(global.__rootdirname, 'test', 'mock','json');

		this.renderUtil= renderUtil({
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
		const ctx   = this;
		this.app.use(function* (){
			const url  = this.req.url;
			const path = join(ctx.ftlDir, url);

			if(url.endsWith('/')){
				const files    = yield fileUtil().getDirInfo(path);
				const promises = files.map((file) => {
					return fileUtil().getFileStat(join(path, file))
				});
				const result   = yield Promise.all(promises);
				const fileList = result.map((item,idx)=>{
					return Object.assign(item, {
						name  : files[idx],
						isFile: item.isFile(),
						url   : [url,files[idx],item.isFile()?'':'/'].join('')
					});
				});
				yield this.render('dir',{ fileList });
			}

			if(url.endsWith('.ftl')){
				const dataModelName = [url.replace(/.ftl$/,''),'.json'].join('');
				const dataPath = join(ctx.mockFtlDir, dataModelName);
				const dataModel = require(dataPath);
				const content  = yield fileUtil().getFileContent(path);
				let target = renderUtil().parser(content, url, dataModel);
				this.type = 'text/html; charset=utf-8';
				this.body = target.stdout;
			}

			if(url.endsWith('.json')){
				const file = join(ctx.mockJsonDir, url);
				const readstream = fileUtil().getFileByStream(file);

				this.type = 'application/json; charset=utf-8';
				this.body = readstream;
			}
		});
	}
	createServer(port = 3000){
		this.app.listen(port);	
		console.log(`freemarker-server is run on port ${port}~ `);
	}
}
new Server({}).createServer();