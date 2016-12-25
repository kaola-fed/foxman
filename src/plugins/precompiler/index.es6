import PreCompiler from './precompiler';
import { SinglePreCompiler } from './precompiler';
import CompilerModel from './CompilerModel';


/**
 * 监听插件
 test: Array<String> or String
 ignore: Array<String> or String
 handler: (dest) => [
 Gulp插件,
 dest(String)
 ]
 */
class PreCompilerPlugin {
	constructor(options) {
		this.options = options;
		Object.assign(this, options);
	}

	init(watcherPlugin) {
		this.watcher = watcherPlugin.watcher;
		this.mapCompiler(this.options.preCompilers);
	}

	mapCompiler(preCompilers) {
		preCompilers.forEach(this.prepare.bind(this));
	}

	prepare(preCompiler) {
		const handler = preCompiler.handler;
		let source = preCompiler.test;
		let ignore = preCompiler.ignore;

		if (!Array.isArray(source)) {
			source = [source];
		}
		source.forEach((sourcePattern) => {
			const compilerModel = new CompilerModel({
				sourcePattern,
				ignore,
				watchMap: {},
				handler
			});
			this.createCompiler(compilerModel);
            
			this.watcher.onNew(sourcePattern, (file, ev, stats) => {
				if ((ev == 'add') 
					&& 
					(new Date().getTime() - new Date(stats.ctime).getTime() >= 1000)) {
					return false;
				}
				this.createCompiler(
					new CompilerModel(compilerModel)
						.setSourcePattern(file)
				);
			});
		});
	}
   
	createCompiler(compilerModel) {
		// {sourcePattern, ignore, watchMap, handler}
		new PreCompiler(compilerModel)
			.run()
			.on('updateWatch', (dependencies) => {
				const diff = this.getNewDeps(
					compilerModel.watchMap, 
					dependencies);
				if (!diff.hasNew) {
					return false;
				}
				this.watcher.onUpdate(diff.list, () => {
					this.createSingleCompiler(
						new CompilerModel(compilerModel)
							.setSourcePattern(dependencies[0])
							.setRelative(compilerModel.sourcePattern), 
						true);
				});
			});
	}
	createSingleCompiler(compilerModel, isWatch) {
		let singleCompiler = new SinglePreCompiler(compilerModel).runInstance(compilerModel.relative);

		if(!isWatch) return;

		singleCompiler
			.on('updateWatch', (dependencies) => {
				const diff = this.getNewDeps(compilerModel.watchMap, dependencies);
				if (!diff.hasNew) {
					return false;
				}
				this.watcher.onUpdate(diff.list, () => {
					this.createSingleCompiler(compilerModel, false);
				});
			});
		return singleCompiler;
	}

	getNewDeps(watchMap, deps) {
		const file = deps[0];
		watchMap[file] = watchMap[file] || [];
		const list = deps.filter((dep) => {
			if ((watchMap[file].indexOf(dep) == -1)) {
				watchMap[file].push(dep);
				return true;
			}
		});
		return {
			hasNew: list.length != 0,
			list
		};
	}
}

export default PreCompilerPlugin;
