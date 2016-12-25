/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';
import 'colors';
import http from 'http';
import https from 'https';
import url from 'url';

export function debugLog(msg) {
	if (process.env.NODE_ENV === 'development') {
		console.log('[DEBUG]'.blue + ' ' + initialsCapitals(msg));
	}
}

export function error(msg) {
	console.log('[E]'.red + ' ' + initialsCapitals(msg));
	process.exit(1);
}

export function log(msg) {
	console.log('[I]'.green + ' ' + initialsCapitals(msg));
}

export function warnLog(msg) {
	console.log('[W]'.yellow + ' ' + initialsCapitals(msg));
}

export function createSystemId() { // uid
	let currentId = 0;
	return function getNext() {
		return ++currentId;
	};
}

export function initialsCapitals(str) {
	return str.replace(/^\b(\w)(\w*)/, function ($0, $1, $2) {
		return $1.toUpperCase() + $2;
	});
}

export function initialsLower(str) {
	return str.replace(/^\b(\w)(\w*)/, function ($0, $1, $2) {
		return $1.toLowerCase() + $2;
	});
}

export function exec(exe, success, failed) {
	child_process.exec(exe, (error, stdout, stderr) => {
		if (error) error(`exec error: ${error}`);

		if (!stderr) success(stdout);
		else failed(stderr);
	});
}

export function jsSpawn(args) {
	let jsSpawn = child_process.spawn('node', args);
	jsSpawn.stderr.on('data', (data) => {
		console.log(`err: ${data}`);
	});
	return {
		stdout: jsSpawn.stdout,
		stderr: jsSpawn.stderr
	};
}

export function removeHeadBreak(str) {
	return str.replace(/^(\/|\\)/, '');
}

export function removeSuffix(str) {
	return str.replace(/\.[^\.]*$/, '');
}

export function jsonPathResolve(url) {
	url = removeSuffix(url) + '.json';

	if (/\.[^\.]*$/.test(url)) {
		return removeHeadBreak(url);
	}
	return url;
}

export function appendHeadBreak(str) {
	if (/^[\/\\]/.test(str)) {
		return str;
	}
	return '/' + str;
}

export function bufferConcat(...bufs) {
	const sizes = bufs.map((buf) => {
		return buf.length;
	});
	let total = sizes.reduce((pre, crt) => {
		return pre + crt;
	});

	return Buffer.concat(bufs, total);
}

export function request(options) {

	let urlInfo = url.parse(options.url);
	delete options.url;

	options = Object.assign({}, urlInfo, options);
	return new Promise((resolve, reject) => {
		const requestBody = options.requestBody;

		delete options.requestBody;

		let protocolMap = {
			http: http,
			https: https
		};
		let protocolHandler = protocolMap[urlInfo.protocol.slice(0, -1)];

		let req = protocolHandler.request(options, (res) => {
			res.body = Buffer.alloc(0);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				res.body = bufferConcat(res.body, Buffer.from(chunk));
			});
			res.on('end', () => {
				resolve(res);
			});
		});

		req.on('error', (e) => {
			reject();
			console.log(`problem with request: ${e.message}`);
		});

		req.write(requestBody);

		req.end();
	});
}
export function typeOf(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function throttle(fn, delay) {
	var timer = null;
	return function () {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

const noteReg = /(([^'"\r\n]*)(\/\/)([^'"]*?)(\n|\r|\r\n))|(\/\*(.*?)\*\/)/g;
export function replaceCommet(str) {
	return str.replace(noteReg, ($0, $1, $2) => ($2 || ''));
}

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export function debounce (func, wait, immediate) {
	var timeout, args, context, timestamp, result;

	var later = function () {
		// 据上一次触发时间间隔
		var last = (+new Date) - timestamp;

		// 上次被包装函数被调用时间间隔last小于设定时间间隔wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return function () {
		context = this;
		args = arguments;
		timestamp = (+new Date);
		var callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
}

export function removeByItem (list, item) {
	const index = list.indexOf(item);
	if (index === -1) return -1;
	removeByIndex(list, index);
	return index;
}

export function removeByIndex (list, index) {
	list.splice(
		index,
		1);
	return index;
}

export default {
	debugLog,
	error,
	warnLog,
	log,
	createSystemId,
	initialsLower,
	initialsCapitals,
	exec,
	jsSpawn,
	jsonPathResolve,
	removeHeadBreak,
	removeSuffix,
	appendHeadBreak,
	bufferConcat,
	request,
	throttle,
	debounce,
	replaceCommet,
	removeByItem,
	removeByIndex
};
