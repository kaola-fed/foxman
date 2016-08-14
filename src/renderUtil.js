import {join} from 'path';
import {spawn} from 'child_process';
const  jarFile = join(global.__rootdirname, 'lib', 'FMtoll.jar');


let renderUtil;
class RenderUtil {
	constructor (settings) {
		this.settings = Object.assign({
			encoding:  'utf-8',
			viewFolder: __dirname
		}, settings);
	}
	parse (path, dataModel) {
		let settings = JSON.stringify(this.settings);
		dataModel    = JSON.stringify(dataModel);
		path         = path.substring(1);

		let cmd = spawn('java', ['-jar', jarFile, settings, path,  ]);
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