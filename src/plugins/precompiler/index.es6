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
            source = [source]
        }
        source.forEach((sourcePattern) => {
            setTimeout(() => {
                let watchMap = {};

                new PreCompiler({
                    sourcePattern, handler
                })
                    .run()
                    .on('updateWatch', (dependencies) => {
                        const diff = this.getNewDeps(watchMap, dependencies);
                        if (diff.length == 0) return false;
                        this.watcher.onChange(diff, (file, arg1) => {
                            this.createSingleCompiler(handler, watchMap, sourcePattern, dependencies[0]);
                        });
                    });

                this.watcher
                    .onChange(sourcePattern, (file) => {
                        this.createSingleCompiler(handler, watchMap, sourcePattern, file);
                    });
            }, 100);
        });
    }
    createSingleCompiler(handler, watchMap, sourcePattern, input) {
        let singleCompiler = new SinglePreCompiler({
            sourcePattern: input,
            handler
        })
            .runInstance(sourcePattern)
            .on('updateWatch', (deps) => {
                const diff = this.getNewDeps(watchMap, deps);
                if (!diff.length) return false;

                this.watcher.onChange(diff, () => {
                    singleCompiler.runInstance(sourcePattern);
                });
            });
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
