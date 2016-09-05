import {Event, BasePlugin,PreCompiler,util} from 'foxman-api';
import path from 'path';
import globule from 'globule';

/**
 * 监听插件
 */
class PreCompilerPlugin extends BasePlugin{
	init(){
		this.mapCompiler(this.options.preCompilers);
	}
	mapCompiler(preCompilers){
		preCompilers.forEach( (preCompiler) => {
			this.prepare(this.app.watcher,preCompiler)
		});
	}
	prepare(watcher, preCompiler){
		let compiler = preCompiler.precompiler;
		let patterns = preCompiler.test;
		let root = this.options.root;
		if(!Array.isArray(patterns)){patterns = [patterns]};

		let files = [];
		patterns.forEach((pattern) => {
			let absPath = path.resolve(root, pattern);
			files = files.concat(globule.find(absPath));
		});

		files.forEach((filename)=>{
			let watchList = [];
			let compilerInstance = new PreCompiler({
				root,
				filename,
				compiler
			});
			compilerInstance.run();

			this.addWatch(watchList, filename, compilerInstance);
			compilerInstance.on('updateWatch', (event) => {
				let dependencys = event.data;
				let news = dependencys.filter( (item) => {
					return (watchList.indexOf(item) === -1);
				});
				if(news.length == 0) return;
				this.addWatch(watchList, news, compilerInstance);
				util.log(`监听\n${filename}的依赖\n|-> ${news.join('\n|->')}`);
			});
		});
	}
	addWatch (watchList, news, compiler) {
		if(Array.isArray(news)) {
			news.forEach((item)=>{watchList.push(item)});
		}else{
			watchList.push(news);
		}
		this.app.watcher.onChange(news, (arg0, arg1) => {
			util.log(`发生变化:${compiler.filename}`);
			compiler.update();
		});
	}
  onReady(){

  }
}

export default PreCompilerPlugin;
