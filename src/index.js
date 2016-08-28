import Application from './application/index.js';

let ower;
class Ower{
	constructor(config){
		const app = Application();
		app.use(config.plugins);
		app.run();
	}
}

module.exports = function (config) {
	if(!ower) ower = new Ower(config);
	return ower;
}
