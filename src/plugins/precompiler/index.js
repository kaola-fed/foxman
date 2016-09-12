import {
    util
} from '../../helper';

import PreCompiler from './precompiler';
import path from 'path';
import globule from 'globule';

/**
 * 监听插件
 */
class PreCompilerPlugin  {
    constructor(options){
      this.options = options;
    }
    init() {
        this.mapCompiler( this.options.preCompilers );
    }
    mapCompiler(preCompilers) {
        preCompilers.forEach((preCompiler) => {
            this.prepare( this.app.watcher, preCompiler)
        });
    }
    prepare(watcher, preCompiler) {
        const handler = preCompiler.handler;
        const root = this.options.root;
        let patterns = preCompiler.test;
        if (!Array.isArray(patterns)) {
            patterns = [patterns]
        };

        let files = [];
        patterns.forEach((pattern) => {
            files = files.concat( globule.find( pattern ).map(( filename )=>{
              util.log(filename);
              return {
                pattern: path.resolve(root, pattern.replace(/\*+.*$/ig,'')),
                filename
              }
            }));
        });
        files.forEach((file) => {
            let [watchList, filename] = [ [], file.filename ];
            let compilerInstance = new PreCompiler( {
                root, file, handler
            } );
            compilerInstance.run();

            this.addWatch( watchList, filename, compilerInstance);
            compilerInstance.on( 'updateWatch', (event) => {
                let dependencys = event;
                let news = dependencys.filter((item) => {
                    return ( watchList.indexOf(item) === -1 );
                });
                if ( !news.length ) return;
                this.addWatch(watchList, news, compilerInstance);
                util.log(filename);
            });
        });
    }
    addWatch(watchList, news, compiler) {
        if (Array.isArray(news)) {
            news.forEach((item) => {
                watchList.push(item)
            });
        } else {
            watchList.push(news);
        }
        this.app.watcher.onChange(news, (arg0, arg1) => {
            util.log( `changed: ${compiler.file.filename}` );
            compiler.update();
        });
    }
}

export default PreCompilerPlugin;
