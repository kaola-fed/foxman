import path from 'path';
import {
    spawn
} from 'child_process';
const jarFile = path.join(global.__rootdir, 'lib', 'FMtoll.jar');

let renderUtil;
class RenderUtil {
    constructor(settings) {
        this.settings = Object.assign({
            encoding: 'utf-8',
            viewFolder: settings.viewFolder
        }, settings);
    }
    parse(p1, dataModel) {
        let settings = JSON.stringify(this.settings);
        dataModel = JSON.stringify(dataModel);
        /**
         * [1] 与相对viewRoot的相对位置
         * [2] / 作为分隔符
         */
        p1 = p1.replace(/^\//g, '').replace(/\\/g, '/');

        let cmd = spawn('java', ['-jar', jarFile, settings, p1, dataModel]);
        cmd.stderr.setEncoding('utf-8');
        
        return {
            stderr: cmd.stderr,
            stdout: cmd.stdout
        };
    }
}
export default function(settings) {
    if (!renderUtil) {
        renderUtil = new RenderUtil(settings);
    }
    return renderUtil;
};
