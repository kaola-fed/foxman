import {join} from 'path';
import fileUtil from './fileUtil';
import renderUtil from './renderUtil';

export function* dirDispatcher (url, path, server, context) {
	const files    = yield fileUtil().getDirInfo(path);
	const promises = files.map((file) => {
		return fileUtil().getFileStat(join(path, file))
	});
	const result   = yield Promise.all(promises);
	const fileList = result.map((item,idx)=>{
		return Object.assign(item, {
			name  : files[idx],
			isFile: item.isFile(),
			url   : [url,files[idx],item.isFile()?'':'/'].join('')
		});
	});

	yield context.render('dir',{ fileList });
}

export function* ftlDispatcher (url, path, server, context) {
	const dataModelName = [url.replace(/.ftl$/,''),'.json'].join('');
	const dataPath  = join(server.mockFtlDir, dataModelName);
	const dataModel = require(dataPath);
	const output      = renderUtil().parse(url, dataModel);

	context.type = 'text/html; charset=utf-8';
	context.body = output.stdout;

	const errInfo = [];
	output.stderr.on('data',function (chunk) {
		errInfo.push(chunk);
	});
	output.stderr.on('end',function () {
		console.log(errInfo.join(''));
	});
}

export function* jsonDispatcher (url, path, server, context) {
	const file       = join(server.mockJsonDir, url);
	const readstream = fileUtil().getFileByStream(file);

	context.type = 'application/json; charset=utf-8';
	context.body = readstream;
}