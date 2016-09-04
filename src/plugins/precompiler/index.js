import {Event, BasePlugin,PreCompiler} from 'foxman-api';
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
		let onChange = this.app.watcher.onChange.bind(this.app.watcher);
		let compiler = preCompiler.precompiler;
		let patterns = preCompiler.test;
		let root = this.options.root;
		if(!Array.isArray(patterns)){patterns = [patterns]};
		let files = [];
		let fileCompilerMap = {};
		patterns.forEach((pattern) => {
			let absPath = path.resolve(root, pattern);
			files = files.concat(globule.find(absPath));
		});
		// console.log(files);

		files.forEach((filename)=>{
			(fileCompilerMap[filename] = new PreCompiler({
				root,
				filename,
				compiler
			})).run();

			watcher.onChange(filename, (arg0, arg1)=>{
				fileCompilerMap[filename].reBuild();
			});
		});
	}
	watch(watcher, preCompiler){
		// let testReg = /([^\*]*\/)*((\*\*\/)?(\*)?\.)([^\*]+)$/ig;
		// let result = testReg.exec(path.resolve(root,preCompiler.test));

		// watcher.onControl(preCompiler.test, (sourcePath, arg1)=>{
			// compilerInstance.run({
			// 	path: sourcePath,
			// 	source: sourcePath.replace(result[1],''),
			// 	text: null
			// });
		// });

		// watcher.onChange(preCompiler.test, (arg0, arg1)=>{
		// 	fileUtil().readFile(arg0).then(function (text) {
		// 		compilerInstance.run({
		// 			path:arg0,
		// 			text: text
		// 		});
		// 	});
		// });
	}
  onReady(){

  }
}

export default PreCompilerPlugin;
