import {join} from 'path';
import {spawn} from 'child_process';
const  jarFile = join(global.__rootdir, 'lib', 'FMtoll.jar');


let renderUtil;
class RenderUtil {
	constructor (settings) {
		this.settings = Object.assign({
			encoding:  'utf-8',
			viewFolder: settings.viewFolder
		}, settings);
	}
	parse (path, dataModel) {
		let settings = JSON.stringify(this.settings);
		dataModel    = JSON.stringify(dataModel);

		let cmd = spawn('java', ['-jar', jarFile, settings, path, dataModel]);
		cmd.stderr.setEncoding('utf-8');

		return {
			stderr: cmd.stderr,
			stdout: cmd.stdout
		};
	}
}
export default function (settings) {
	if(!renderUtil){ renderUtil = new RenderUtil(settings);}
	return renderUtil;
};
