/**
 * 预处理器 api，用于
 */
import {resolve, relative} from 'path';
import vinylFs from 'vinyl-fs';
import EventEmitter from 'events';
import {
    util
} from '../../helper';

class PreCompiler extends EventEmitter {
    constructor(options) {
        super();
        Object.assign(this, options);
    }
    pipe(...args) {
        this.source = this.source.pipe.apply(this.source, args);
        args[0].on('returnDependencys', (imports) => {
            this.emit('updateWatch', imports);
        });
        return this;
    }
    run() {
        let workFlow = this.handler(vinylFs.dest.bind(this));
        this.source = vinylFs.src(this.sourcePattern);
        workFlow.forEach((item) => {
            this.pipe(item);
        });
        return this;
    }
}
class SinglePreCompiler extends PreCompiler {
    destInstence(sourcePattern) {
        return (dest) => {
            /**
             * 获取输入文件的相对根目录
             * @type {XML|string|void|*}
             */
            let sourceRoot = sourcePattern.replace(/\*+.*$/, '');
            /**
             * 得到输出文件的完整文件名
             */
            let output = resolve(dest, relative(sourceRoot, this.sourcePattern));
            /**
             * 输出文件
             */
            let target = resolve(output, '..');
            util.log(`${this.sourcePattern} -> ${target}`);
            return vinylFs.dest.call(vinylFs, target);
        }
    }
    runInstance(sourcePattern) {
        try {
            this.source = vinylFs.src(this.sourcePattern);
            this.handler(this.destInstence.call(this, sourcePattern)).forEach((item) => {
                this.pipe(item);
            });

        } catch (err) {
            console.log(err);
        }
        return this;
    }
}

export {SinglePreCompiler};

export default PreCompiler;

