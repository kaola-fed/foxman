import PreCompiler from './precompiler';
import { SinglePreCompiler } from './precompiler';


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
		let recentBuild = [];

		if (!Array.isArray(source)) {
			source = [source];
		}
		source.forEach((sourcePattern) => {
			let watchMap = {};
			this.createCompiler(sourcePattern, ignore, watchMap, handler);
            /**
             * 新创建的文件的监听
             */
			this.watcher.onNew(sourcePattern, (file, ev, stats) => {
				if (((ev == 'change') && (-1 == recentBuild.indexOf(file)))
                    || ((ev == 'add') && (new Date().getTime() - new Date(stats.ctime).getTime() >= 1000))) {
					return false;
				}
				recentBuild.push(file);
				this.createCompiler(file, ignore, watchMap, handler);
			});
		});
	}
    /**
     * ignore 为 glob 方式的 ignore
     */
	createCompiler(sourcePattern, ignore, watchMap, handler) {
		new PreCompiler({
			sourcePattern, ignore, handler
		}).run().on('updateWatch', (dependencies) => {
			const diff = this.getNewDeps(watchMap, dependencies);
            /** 没有更新 */
			if (!diff.length) {
				return false;
			}
			this.watcher.onUpdate(diff, () => {
				this.createSingleCompiler(sourcePattern, ignore, watchMap, handler, dependencies[0]);
			});
		});
	}
	createSingleCompiler(sourcePattern, ignore, watchMap, handler, input) {
		let singleCompiler = new SinglePreCompiler({
			sourcePattern: input,
			ignore,
			handler
		}).runInstance(sourcePattern);
		return singleCompiler;
	}

	getNewDeps(watchMap, deps) {
		const file = deps[0];
		watchMap[file] = watchMap[file] || [];

		return deps.filter((dep) => {
			if ((watchMap[file].indexOf(dep) == -1)) {
				watchMap[file].push(dep);
				return true;
			}
		});
	}
}

export default PreCompilerPlugin;
