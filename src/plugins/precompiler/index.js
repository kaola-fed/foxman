import {
    util
} from '../../helper';
import PreCompiler from './precompiler';
import globule from 'globule';

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
        let patterns = preCompiler.test;

        if (!Array.isArray(patterns)) {
            patterns = [patterns]
        }

        patterns.forEach((pattern)=> {
            let watchMap = {};
            new PreCompiler({
                pattern, handler
            })
            .run()
            .on('updateWatch', (dependencies)=> {
                const filename = dependencies[0];
                const diff = [];
                watchMap[filename] = watchMap[filename] || [];
                dependencies.forEach((dependency)=> {
                    if ((watchMap[filename].indexOf(dependency) == -1)) {
                        watchMap[filename].push(dependency);
                        diff.push(dependency);
                    }
                });

                if (diff.length == 0) return false;
                this.watcher.onChange(diff, (file, arg1) => {
                    new PreCompiler({
                        pattern: filename,
                        handler
                    }).runInstance(pattern);
                });
            });
        });
    }
}

export default PreCompilerPlugin;
