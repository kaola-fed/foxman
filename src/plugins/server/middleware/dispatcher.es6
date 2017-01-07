import path from 'path';
import { fileUtil, DispatherTypes } from '../../../helper';

function apiHandler(dispatcher) {
	if(dispatcher.handler) {
		return dispatcher.handler(this).then((data) => {
			let json;
			try {
				json = JSON.parse(data);
			} catch (error) {
				json = {
					error: error.toString(),
					data
				};
			}
			return new Promise(resolve=>{
				resolve({
					json: json
				});
			});
		});
	}
	return fileUtil.jsonResolver({ url: dispatcher.dataPath });
}

/**
 * default dispatcher
 * @param  {[type]} dispatcher  [description]
 * @param  {[type]} config [description]
 * @param  {[type]} next [description]
 * @return {[type]}         [description]
 */
export function* dirDispatcher(dispatcher, config, next) {
	const sortFiles = (list) => {
		return list.sort((a, b)=>{
			return a.name.charAt(0).localeCompare(b.name.charAt(0));
		});
	};
	const viewPath = dispatcher.pagePath;
	const files = yield fileUtil.getDirInfo(viewPath);
	const promises = files.map((file) => fileUtil.getFileStat(path.resolve(viewPath, file)));
	let result = (yield Promise.all(promises)).map((item, idx) => {
		return Object.assign(item, {
			name: files[idx],
			isFile: item.isFile(),
			requestPath: [this.request.path, files[idx], item.isFile() ? '' : '/'].join('')
		});
	});

	const fileList = sortFiles(result.filter((item)=>{
		return item.isFile;
	}));
	const dirList = sortFiles(result.filter((item)=>{
		return !item.isFile;
	}));

	yield this.render('cataLog', {
		title: '查看列表',
		showList: dirList.concat(fileList)
	});
	yield next;
}

/**
 * 同步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* syncDispatcher(dispatcher, config, next) {
	const filePath = dispatcher.pagePath;
	let res = yield apiHandler.call(this, dispatcher);

	if (!res || !res.json) {
		this.type = 500;
		yield this.render('e', {
			title: '出错了', e: {
				code: 500,
				msg: '数据处理异常'
			}
		});
		return yield next;
	}
	const result = yield config.tplRender.parse(filePath, res.json);
  /**
   * error
   * content
   */
	if (!result.error) {
		this.type = 'text/html; charset=utf-8';
		this.body = result.content || '数据未取到';
		return yield next;
	}
	yield this.render('e', {
		title: '出错了', e: {
			code: 500,
			msg: result.error
		}
	});
	return yield next;
}

/**
 * 异步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* asyncDispather(dispatcher, config, next) {
  /**
   * 异步接口处理
   * @type {[type]}
   */
	let res = yield apiHandler.call(this, dispatcher);
	if (res && res.json) {
		this.type = 'application/json; charset=utf-8';
		this.body = res.json;
		return yield next;
	}
	yield this.render('e', {
		title: '出错了', e: {
			code: 500,
			msg: '请求代理服务器异常'
		}
	});
	yield next;
}

export default (config) => {
	return function* (next) {
	  /**
	   * 分配给不同的处理器
	   * @type {Object}
	   */
		let args = [config, next];

		let dispatcherMap = {
			[DispatherTypes.DIR]: dirDispatcher,
			[DispatherTypes.SYNC]: syncDispatcher,
			[DispatherTypes.ASYNC]: asyncDispather
		};

		let dispatcher = dispatcherMap[this.dispatcher.type];
		if (dispatcher) {
			yield dispatcher.call(this, this.dispatcher, ...args);
		}
	};
};
