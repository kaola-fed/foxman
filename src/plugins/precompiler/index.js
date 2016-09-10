import {
    BasePlugin,
    util
} from '../../helper';

import PreCompiler from './precompiler';
import path from 'path';
import globule from 'globule';

/**
 * 监听插件
 */
class PreCompilerPlugin extends BasePlugin {
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
            files = files.concat( globule.find( path.resolve(root, pattern ) ) );
        });
        files.forEach((filename) => {
            let watchList = [];
            let compilerInstance = new PreCompiler( {
                root,
                filename,
                handler
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
                util.log(`${filename} \n      ${news.join('\n      ')}`.replace(new RegExp(root,'ig'),''));
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
            util.log( `changed: ${compiler.filename}`.replace(new RegExp(this.options.root,'ig'),'') );
            compiler.update();
        });
    }
}

export default PreCompilerPlugin;
