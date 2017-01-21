import PreCompiler, {SinglePreCompiler} from './precompiler';
import CompilerModel from './CompilerModel';
import {util} from '../../helper';

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
        Object.assign(this, options);

        if (!this.preCompilers) {
            this.preCompilers = [];
        }
    }

    init(watcherPlugin) {
        this.watcher = watcherPlugin.watcher;
        this.mapCompiler(this.preCompilers);
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

        const taskName = util.sha1(source.join("-"));

        source.forEach((sourcePattern) => {
            const compilerModel = new CompilerModel({
                sourcePattern,
                ignore,
                watchMap: {},
                handler,
                taskName
            });
            const compileFn = (file) => {
                this.createSingleCompiler(
                    new CompilerModel(compilerModel)
                        .setSourcePattern(file)
                        .setRelative(sourcePattern)
                );
            };
            this.createCompiler(compilerModel);
            this.watcher.onNew(sourcePattern, compileFn);
            this.watcher.onUpdate(sourcePattern, compileFn);
        });
    }

    /**
     * @description 初次执行
     */
    createCompiler(compilerModel) {
        new PreCompiler(compilerModel)
            .run()
            .on('returnDeps', (info) => {
                const diff = this.getNewDeps(
                    compilerModel.watchMap,
                    info.deps);
                if (!diff.hasNew) {
                    return false;
                }
                this.watcher.onUpdate(diff.list, () => {
                    this.createSingleCompiler(
                        new CompilerModel(compilerModel)
                            .setSourcePattern(info.source)
                            .setRelative(compilerModel.sourcePattern),
                        true);
                });
            });
    }

    /**
     * @description 文件修改执行
     */
    createSingleCompiler(compilerModel, isWatch) {
        let singleCompiler = new SinglePreCompiler(compilerModel).runInstance(compilerModel.relative);

        if (!isWatch) return;

        singleCompiler
            .on('returnDeps', (info) => {
                const diff = this.getNewDeps(compilerModel.watchMap, info.deps);
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
            if ((watchMap[file].indexOf(dep) === -1)) {
                watchMap[file].push(dep);
                return true;
            }
        });

        return {
            hasNew: list.length !== 0,
            list
        };
    }
}

export default PreCompilerPlugin;
