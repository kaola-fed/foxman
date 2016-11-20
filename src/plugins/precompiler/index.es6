import {
    util
} from '../../helper';
import PreCompiler from './precompiler';
import {SinglePreCompiler} from './precompiler';


/**
 * 监听插件
 test: Array<String> or String
 exclude: Array<String> or String
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
        let exclude = preCompiler.exclude;
        let recentBuild = [];

        if (!Array.isArray(source)) {
            source = [source];
        }
        source.forEach((sourcePattern) => {
            let watchMap = {};
            this.createCompiler(sourcePattern, exclude, watchMap, handler);
            /**
             * 新创建的文件的监听
             */
            this.watcher.onNew(sourcePattern, (file, ev, stats) => {
                if (((ev == 'change') && (-1 == recentBuild.indexOf(file)))
                    || ((ev == 'add') && (new Date().getTime() - new Date(stats.ctime).getTime() >= 1000))) {
                    return false;
                }
                recentBuild.push(file);
                this.createCompiler(file, exclude, watchMap, handler);
            });
        });
    }
    createCompiler(sourcePattern, exclude, watchMap, handler){
        new PreCompiler({
            sourcePattern, exclude, handler
        }).run().on('updateWatch', (dependencies) => {
            const diff = this.getNewDeps(watchMap, dependencies);
            /** 没有更新 */
            if (!diff.length) {
                return false;
            }
            this.watcher.onUpdate(diff, (file, ev) => {
                this.createSingleCompiler(sourcePattern, exclude, watchMap, handler, dependencies[0]);
            });
        });
    }
    createSingleCompiler(sourcePattern, exclude, watchMap, handler, input) {
        let singleCompiler = new SinglePreCompiler({
            sourcePattern: input,
            exclude,
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
