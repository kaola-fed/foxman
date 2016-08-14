import {readdir, lstat, fstat	,readFile} from 'fs';
import {join} from 'path';
import {spawn} from 'child_process';
const  jarFile = join(global.__rootdirname,'lib',"FMtoll.jar");


let renderUtil;
class RenderUtil {
	constructor (settings) {
		this.settings = Object.assign({
			encoding: 'utf-8',
			viewFolder: __dirname
		}, settings);
	}
	parser (ftlStr, path, dataModel) {
		const ctx = this;
		dataModel = JSON.stringify(dataModel);
		let cmd = spawn('java', ["-jar", jarFile, JSON.stringify(ctx.settings), path.substring(1), dataModel ]);
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