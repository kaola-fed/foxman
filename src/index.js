import Application from './application/index';
import ServerPlugin from './server/index';
import WatcherPlugin from './watcher/index';
import PreCompilerPlugin from './precompiler/index';
import {error, log} from './util/util';

let ower;
class Ower{
	constructor(config){
		const app = Application();
		const root = {
				root: config.root
		};
		/**
		 * __setConfig
		 */
		app.setConfig(config);

		/**
		 * 内置组件
		 */
		app.use(WatcherPlugin,     Object.assign(config.watch,root));
		app.use(ServerPlugin,      Object.assign(config.server,root));/** main **/
		app.use(PreCompilerPlugin, Object.assign(config.preCompilers,root));/** main **/

		/**
		 * __loadPlugins
		 */
		app.use(config.plugins);

		/**
		 * __ready
		 */
		app.run();

		/** start server **/


		/** start server **/
	}
}

module.exports = function (config) {
	if(!ower) ower = new Ower(config);
	return ower;
}
