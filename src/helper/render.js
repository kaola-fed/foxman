import path from 'path';
import {
    spawn
} from 'child_process';
import  Freemarker from 'freemarker.js';

let renderUtil;
class RenderUtil {
    constructor(settings) {
        this.freemarker = new Freemarker(Object.assign({
            viewRoot: settings.viewRoot
        }, settings));
    }

    parse(p1, dataModel) {
        return new Promise((resolve, reject) => {
            this.freemarker.render(p1, dataModel, function (err, data, out) {
                resolve({err, data, out});
            });
        });
        // let settings = JSON.stringify(this.settings);
        // /**
        //  * [1] 与相对viewRoot的相对位置
        //  * [2] / 作为分隔符
        //  */
        // p1 = p1.replace(/^\//g, '').replace(/\\/g, '/');
        //
        // let cmd = spawn('java', ['-jar', jarFile, settings, p1, dataModel]);
        // cmd.stderr.setEncoding('utf-8');
        //
        // return {
        //     stderr: cmd.stderr,
        //     stdout: cmd.stdout
        // };
    }
}
export default RenderUtil;