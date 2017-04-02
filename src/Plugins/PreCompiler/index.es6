import PreCompiler from './PreCompiler';
import FileUpdater from './FileUpdater';
import CompilerModel from './CompilerModel';
import {util} from '../../helper';

class PreCompilerPlugin {
    constructor(options) {
        Object.assign(this, options);
    }
    /**
     * @param  {Plugin} watcherPlugin
     */
    init(watcherPlugin) {
        this.watcher = watcherPlugin.watcher;
        (this.preCompilers || []).forEach((item) => this.start(item));
    }
    /**
     * @property {function} handler
     * @property  {string} test
     */
    start({handler, test, watch = true}) {
        const source = (Array.isArray(test))? test: [test];
        const taskName = util.sha1(source.join("-"));

        source.forEach(sourcePattern => {
            const compilerModel = new CompilerModel({
                sourcePattern, taskName, watch,
                watchMap: {}, handler
            });
            const compileFn = file => {
                this.fileUpdate(
                    new CompilerModel(compilerModel)
                        .setSourcePattern(file)
                        .setRelative(sourcePattern), true
                );
            };

            this.initCompiler(compilerModel);
            if (watch) {
                this.watcher.onNew(sourcePattern, compileFn);
                this.watcher.onUpdate(sourcePattern, compileFn);
            }
        });
    }

    /**
     * @param  {CompilerModel} compilerModel
     */
    initCompiler(compilerModel) {
        const preCompiler = new PreCompiler(compilerModel).run();
        const watchMap = compilerModel.watchMap;
        
        preCompiler.on('returnDeps', info => {
            const {source, hasNew, list} = PreCompilerPlugin.getNewDeps(watchMap, info);
            if (!hasNew) return false;
            if (!compilerModel.watch) return false;
            
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
     * @param  {CompilerModel} compilerModel
     * @param  {boolean} isWatch=false
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
     * @param  {CompilerModel} compiler
     * @param  {object} watchMap
     */
    static getDiff(compiler, watchMap) {
        return new Promise((resolve, reject) => {
            compiler.once('returnDeps', info => {
                resolve(PreCompilerPlugin.getNewDeps(watchMap, info))
            });
        })
    }
    /**
     * @param  {object} watchMap={}
     * @param  {object} options
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
