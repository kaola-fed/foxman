/**
 * dispatcher
 * type
 * filePath
 * tplPath
 * dataPath(sync才有)
 */
import {
    util, DispatherTypes
} from '../../../helper';
import path from 'path';
import pathToRegexp from 'path-to-regexp';

/**
 * 全局中间件,会将具体的页面转换成需要的资源
 * 1.同步
 *  { commonTplPath,commonSync }
 * 2.异步
 *  { commonAsync }
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */

const getDispatcherMap = (config) => {
	const dispatcherMap = new Map();
	dispatcherMap.set('/', {
		type: DispatherTypes.DIR
	});
	dispatcherMap.set(`.${config.extension}`, {
		type: DispatherTypes.SYNC
	});
	dispatcherMap.set('.json', {
		type: DispatherTypes.ASYNC
	});
	return dispatcherMap;
};

export default (config) => {
	const dispatcherMap = getDispatcherMap(config);
	return function* (next) {
    /**
     * ① 拦截 router
     * @type {[type]}
     */
		const [routers, method] = [config.routers || [], this.request.method];

    /**
     * 入口时，自动转换
     */
		let requestPath = (this.request.path == '/') ? '/index.html' : this.request.path;

		if (this.request.query.mode != 1) {
      /**
       * 遍历路由表,并给请求对象处理,生成 this.dispatcher
       */
			for (let router of routers) {

				if (config.divideMethod && router.method.toUpperCase() !== method.toUpperCase()) {
					continue;
				}

				if (!pathToRegexp(router.url).test(this.request.path)) {
					continue;
				}

				let filePath = router.filePath;

				if (router.sync) {
					const tplName = util.removeSuffix(router.filePath, config.extension);
					let pagePath = path.join(config.viewRoot, `${tplName}.${config.extension}`);
					let dataPath = path.join(config.syncData, `${tplName}.json`);
					this.dispatcher = {
						type: 'sync',
						pagePath,
						dataPath
					};
				} else {
					let dataPath = path.join(config.asyncData, `${router.filePath}.json`);
					this.dispatcher = {
						type: 'async',
						dataPath
					};
				}

				this.dispatcher.filePath = filePath;
				this.dispatcher.isRouter = true;
				this.dispatcher.handler = router.handler;

				return yield next;
			}
		}

    /**
     * ② 未拦截到 router
     */
		let jsonPath = util.jsonPathResolve(requestPath);
		for (let [type, route] of dispatcherMap) {
			if (this.request.path.endsWith(type)) {
				this.dispatcher = {
					type: route.type,
					isRouter: false,
					filePath: requestPath,
					pagePath: path.join(config.viewRoot, this.request.path),
					dataPath: {
						[DispatherTypes.DIR]: null,
						[DispatherTypes.SYNC]: config.syncDataMatch(jsonPath),
						[DispatherTypes.ASYNC]: config.asyncDataMatch(jsonPath)
					}[route.type]
				};
				return yield next;
			}
		}
	};
};
