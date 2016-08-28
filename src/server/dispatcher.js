import {join} from 'path';
import fileUtil from '../util/fileUtil';
import renderUtil from '../util/renderUtil';
import {error} from '../util/util.js';

export function* dirDispatcher (url, config, context) {

	const path     = join(config.path.root, url);
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

	yield context.render('cataLog',{ fileList });
}

export function* ftlDispatcher (url, config, context) {
	const dataPath = join(config.path.syncData, url.replace(/.ftl$/,'') + '.json');

	let dataModel;
	try{
		dataModel = require(dataPath);
	}catch(err){
		error(`${dataPath} is not found!`);
	}
	const output    = renderUtil().parse(url, dataModel);
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

export function* jsonDispatcher (url, config, context) {
	const file = join(config.path.asyncData, url);
	const json = fileUtil().getFileByStream(file);

	context.type = 'application/json; charset=utf-8';
	context.body = json;
}
