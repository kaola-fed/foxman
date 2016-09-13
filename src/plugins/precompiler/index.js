import {
    util
} from '../../helper';

import PreCompiler from './precompiler';
import path from 'path';
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
class PreCompilerPlugin  {
    constructor(options){
      this.options = options;
    }
    init() {
        this.watcher = this.app.watcher;
        this.mapCompiler( this.options.preCompilers );
    }
    mapCompiler( preCompilers ) {
        preCompilers.forEach((preCompiler) => {
            this.prepare( preCompiler );
        });
    }
    prepare( preCompiler) {
        const handler = preCompiler.handler;
        const root = this.options.root;

        let excludes = preCompiler.exclude || [];
        if( !Array.isArray(excludes) ) excludes = [ excludes ];

        let excludeReg = new RegExp(`(${excludes.join(")||(")})`,'ig');

        let patterns = preCompiler.test;

        if ( !Array.isArray(patterns) ) {
            patterns = [ patterns ]
        };

        let files = [];
        patterns.forEach((pattern) => {
            files = files.concat( globule.find( path.resolve(root ,pattern) ).map(( filename )=>{
              util.log(`source file: ${filename}`);
              return {
                pattern: path.resolve(root, pattern.replace(/\*+.*$/ig,'')),
                filename
              }
            }));
        });

        files.forEach((file) => {
            let [watchList, filename] = [ [], file.filename ];

            if( excludeReg.test( 'src/mcss/1.mcss' ) ) {
              return false;
            }

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

        this.watcher.onChange(news, (arg0, arg1) => {
            util.log( `changed: ${compiler.file.filename}` );
            compiler.update();
        });
    }
}

export default PreCompilerPlugin;
