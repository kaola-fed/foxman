import {EventEmitter} from 'event';

class Application extends Emitter {
	constructor() {

		this.dependencies = [];
		this.runtimeHandler = [];
		this.current = 0;
	}
	use(obj) {
		if(obj.runType == 'pre' && obj.handler){
			this.dependencies.push(obj.handler);
		}else{
			this.runtimeHandler();
		}

		this.middleware.push(fn);
	}
	run(...args) {
		this.middleware.forEach( (fn) => {
			fn(args);
		});
	}
} 

