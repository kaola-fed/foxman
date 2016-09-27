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
        preCompilers.forEach((preCompiler) => {
            this.prepare(preCompiler);
        });
    }

    prepare(preCompiler) {
        const handler = preCompiler.handler;
        let source = preCompiler.test;

        if (!Array.isArray(source)) {
            source = [source];
        }
        source.forEach((sourcePattern) => {
            let watchMap = {};
            new PreCompiler({
                sourcePattern, handler
            }).run().on('updateWatch', (dependencies) => {
                const diff = this.getNewDeps(watchMap, dependencies);
                /** 没有更新 */
                if (!diff.length) {
                    return false;
                }
                this.watcher.onUpdate(diff, (file, ev) => {
                    this.createSingleCompiler(handler, watchMap, sourcePattern, dependencies[0]);
                });
            });
            /**
             * 初始化后的文件新增监听
             */
            this.watcher.onNew(sourcePattern, (file, ev, stats) => {
                if (new Date().getTime() - new Date(stats.birthtime).getTime() <= 1000) {
                    this.createSingleCompiler(handler, watchMap, sourcePattern, file);
                }
            });
        });
    }

    createSingleCompiler(handler, watchMap, sourcePattern, input) {
        let singleCompiler = new SinglePreCompiler({
            sourcePattern: input,
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
