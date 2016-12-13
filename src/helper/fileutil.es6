/**
 * 通用文件系统处理
 *
 * import {getFileByStream,...} from 'fileUtil'
 * or
 *
 * import fileUtil from 'fileUtil'
 * then
 *    fileUtil.getFileByStream
 *  ...
 */

import fs from 'fs';
import path from 'path';
import _ from './util';

export function getFileByStream(path) {
	return fs.ReadStream(path);
}

export function getDirInfo(dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) {
				return reject(err);
			}
			resolve(files);
		});
	});
}

export function getFileStat(file) {
	return new Promise(function (resolve, reject) {
		fs.lstat(file, function (err, stat) {
			if (err) {
				return reject(err);
			}
			resolve(stat);
		});
	});
}

export function readFile(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf-8', function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

export function writeFile(filename, text) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, text, (err) => {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}

export function writeUnExistsFile(file, text) {
	let needCreateStack = [file];

	return new Promise((...args) => {
		const search = () => {
			file = path.resolve(file, '../');
			fs.stat(file, (err) => {
				if (err) {
					needCreateStack.push(file);
					search();
				} else {
					create();
				}
			});
		};
		const create = () => {
			let file = needCreateStack.pop();
			if (needCreateStack.length != 0) {
				return fs.mkdir(file, create);
			}
			writeFile(file, text).then(...args);
		};
		search();
	});
}

export function jsonResolver(opt) {
	return new Promise((resolve) => {
		let url = (typeof opt == 'string') ? opt : opt.url;
		let json;
		if (/^http/g.test(url)) {
			_.log(`请求转发:${url}`);
			_.request(opt).then((res) => {
				try {
					json = JSON.parse(res.body.toString('utf-8'));
				} catch (e) {
					json = null;
				}
				res.json = json;
				resolve(res);
			}, (err) => {
				console.log(err);
				resolve(null);
			});
			return;
		}
		readFile(url).then((data) => {
			try {
                /**去除注释 */
				json = JSON.parse(_.replaceCommet(data));
			} catch (e) {
				console.log(e);
				json = {};
			}
			resolve({ json });
		}, () => {
			_.warnLog(`localFile ${url} is not found, so output {}`);
			resolve({ json: {} });
		});
	});
}
export function delDir(file) {
	if (fs.statSync(file).isFile()) {
		fs.unlinkSync(file);
	} else {
		var children = fs.readdirSync(file);
		if (children && children.length != 0) {
			children.forEach(function (item) {
				delDir(path.join(file, item));
			});
		}
		fs.rmdirSync(file);
	}
}

export default {
	getFileByStream,
	getDirInfo,
	getFileStat,
	readFile,
	writeFile,
	writeUnExistsFile,
	jsonResolver,
	delDir
};
