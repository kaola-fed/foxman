/**
 * 预处理器 api，用于
 */
import {resolve, relative} from 'path';
import vinylFs from 'vinyl-fs';
import EventEmitter from 'events';

class PreCompiler extends EventEmitter{
    constructor(options) {
        super();
        Object.assign(this, options);
    }
    pipe(...args) {
        this.source = this.source.pipe.apply(this.source, args);
        args[0].resolveDeps  = (imports)=>{
            this.emit('updateWatch', imports);
        };
        return this;
    }

    run() {
        let workFlow = this.handler(vinylFs.dest.bind(this));
        this.source = vinylFs.src(this.pattern);
        workFlow.forEach((item)=>{
            this.pipe(item);
        });
        return this;
    }

    destInstence (pattern) {
        return (dest) => {
            console.log(this.pattern);
            let sourceRoot = pattern.replace(/\*+.*$/,'');
            let output = resolve(dest, relative(sourceRoot,this.pattern));
            return vinylFs.dest.call(vinylFs, resolve(output,'..'));
        }
    }
    runInstance(pattern){
        this.source = vinylFs.src(this.pattern);
        this.handler( this.destInstence.call(this, pattern) ).forEach( (item) => {
            this.pipe(item);
        });
        return this;
    }
}
export default PreCompiler;
