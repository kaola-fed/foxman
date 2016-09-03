import {Event, BasePlugin,PreCompiler} from 'foxman-api';
import {error,
				log,
				debugLog,
				warnLog
			} from '../util/util';
import fileUtil from '../util/fileUtil';
import path from 'path';
console.log(path.relative);
/**
 * 监听插件
 */
class PreCompilerPlugin extends BasePlugin{
	init(){
		this.mapCompiler(this.options);
	}
	mapCompiler(preCompilers){
		preCompilers.forEach( (preCompiler) => {
			this.watch(this.app.watcher,preCompiler)
		});
	}
	watch(watcher, preCompiler){
		let root = this.options.root;
		let compiler = preCompiler.precompiler;
		let onChange = this.app.watcher.onChange.bind(this.app.watcher);
		let compilerInstance = new PreCompiler({
			compiler,
			onChange,
			root
		});
		let testReg = /([^\*]*\/)*((\*\*\/)?(\*)?\.)([^\*]+)$/ig;
		let result = testReg.exec(path.resolve(root,preCompiler.test));

		watcher.onControl(preCompiler.test, (sourcePath, arg1)=>{
			compilerInstance.run({
				path: sourcePath,
				source: sourcePath.replace(result[1],''),
				text: null
			});
		});

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
