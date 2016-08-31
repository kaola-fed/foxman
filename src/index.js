import Application from './application/index';
import ServerPlugin from './server/index';
import WatcherPlugin from './watcher/index';
import {error, log} from './util/util';

let ower;
class Ower{
	constructor(config){
		const app = Application();
		app.use(config.plugins);
		app.use(WatcherPlugin,config);
		app.use(ServerPlugin, config);
		app.run();

		/** start server **/

		// new Server(config).startServer();

		/** start server **/

	}
}

module.exports = function (config) {
	if(!ower) ower = new Ower(config);
	return ower;
}
