import Application from './application/index';
import ServerPlugin from './server/index';
import WatcherPlugin from './watcher/index';
import {error, log} from './util/util';

let ower;
class Ower{
	constructor(config){
		const app = Application();
		/**
		 * __setConfig
		 */
		app.setConfig(config);

		/**
		 * __loadPlugins
		 */
		app.use(config.plugins);
		/**
		 * 内置组件
		 */
		app.use(WatcherPlugin,config);
		app.use(ServerPlugin,config);/** main **/

		/**
		 * __updateFile
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
