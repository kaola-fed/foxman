import PreCompiler from './PreCompiler';
import vinylFs from 'vinyl-fs';
import {util} from '../../helper';
import { resolve, relative, sep } from 'path';

class FileUpdater extends PreCompiler {
    /**
     * @param  {string} sourcePattern
     */
    destInstence(sourcePattern) {
        return (dest) => {
            /**
             * @TODO Replace With Glob Standard
             */
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
            let target = sourceRoot.endsWith(sep) ? resolve(output, '..') : output;
            util.notify({
                'title': '文件预处理操作',
                'msg': `${this.sourcePattern} -> ${target}`
            });
            return vinylFs.dest(target);
        };
    }
    /**
     * @param  {string} sourcePattern
     */
    runInstance(sourcePattern) {
        try {
            this.source = vinylFs.src(this.sourcePattern);
            const workFlow = this.handler(this.destInstence(sourcePattern));
            workFlow.forEach((item) => {
                this.pipe(item);
            });
        } catch (err) {
            util.warnLog(err);
        }
        return this;
    }
}

export default FileUpdater;