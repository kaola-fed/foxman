import PreCompiler from './PreCompiler';
import FileUpdater from './FileUpdater';
import CompilerModel from './CompilerModel';
import { util } from '../../helper';

class PreCompilerPlugin {
    constructor(options) {
        Object.assign(this, options);
    }
    /**
     * @param  {} watcherPlugin
     */
    init(watcherPlugin) {
        this.watcher = watcherPlugin.watcher;
        (this.preCompilers || []).forEach((item) => this.start(item));
    }
    /**
     * @param  {} handler
     * @param  {} test
     * @param  {} ignore
     */
    start({handler, test, ignore}) {
        const source = (Array.isArray(test))? test: [test];
        const taskName = util.sha1(source.join("-"));

        source.forEach(sourcePattern => {
            const compilerModel = new CompilerModel({
                sourcePattern, ignore, taskName,
                watchMap: {}, handler
            });
            const compileFn = file => {
                this.fileUpdate(
                    new CompilerModel(compilerModel)
                        .setSourcePattern(file)
                        .setRelative(sourcePattern), true
                );
            };

            this.watcher.onNew(sourcePattern, compileFn);
            this.watcher.onUpdate(sourcePattern, compileFn);
            this.initCompiler(compilerModel);
        });
    }

    /**
     * @param  {} compilerModel
     */
    initCompiler(compilerModel) {
        const preCompiler = new PreCompiler(compilerModel).run();
        PreCompilerPlugin.getDiff(preCompiler, compilerModel.watchMap).then(({source, hasNew, list}) => {
            if (!hasNew) return false;
            this.watcher.onUpdate(list, () => {
                this.fileUpdate(
                    new CompilerModel(compilerModel)
                        .setSourcePattern(source)
                        .setRelative(compilerModel.sourcePattern),
                    true);
            });
        });
    }
    
    /**
     * @param  {} compilerModel
     * @param  {} isWatch=false
     */
    fileUpdate(compilerModel, isWatch = false) {
        let fileUpdater = new FileUpdater(compilerModel).runInstance(compilerModel.relative);
        if (!isWatch) return;

        PreCompilerPlugin.getDiff(fileUpdater, compilerModel.watchMap).then(({hasNew, list}) => {
            if (!hasNew) return;
            this.watcher.onUpdate(list, () => {
                this.fileUpdate(compilerModel, false);
            });
        });
    }
    /**
     * @param  {} compiler
     * @param  {} watchMap
     */
    static getDiff(compiler, watchMap) {
        return new Promise((resolve, reject) => {
            compiler.once('returnDeps', info => {
                resolve(PreCompilerPlugin.getNewDeps(watchMap, info))
            });
        })
    }
    /**
     * @param  {} watchMap={}
     * @param  {} source=
     * @param  {} deps=[]}
     */
    static getNewDeps(watchMap = {}, {source = '', deps = []}) {
        if (!watchMap[source]) {
            watchMap[source] = [];
        }
        const list = deps.filter(dep => {
            const notWatched = (watchMap[source].indexOf(dep) === -1);
            if (notWatched) {
                watchMap[source].push(dep);
            }
            return notWatched;
        });
        return {
            hasNew: list.length !== 0,
            source,
            list
        };
    }
}

export default PreCompilerPlugin;
