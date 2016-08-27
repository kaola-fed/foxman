import {EventEmitter} from 'events';

class Application extends EventEmitter {
	constructor() {	
		super();
		this.middleware = [];
		this.eventsBinder = {};
		this.current = 0;
	}

	use(Component,options) {
		
		if(Array.isArray(Component) && !options){
			Component.forEach((plugin)=>{
				this.use(plugin.component, plugin.options);
			});
			return;
		}
		const component = new Component(options);
		this.middleware.push(component);

	}
	run(...args) {
		// this.middleware.forEach( (fn) => {
		// 	fn.apply(this, args);
		// });
		
		this.setState('preRun');
	}
	on(msg, event){
		super.on(arguments);
		Object.assign(this.eventsBinder[msg] = this.eventsBinder[msg] || {},
			{
				desc: event.getDesc()
			},
			{
				bindCount: 1+(this.eventsBinder.bindCount||0)
			});
	}
	emit(msg ,event){
		super.emit(arguments);
		try{
			delete this.eventsBinder[msg][event.desc]
		}catch(err){

		}
	}
	setState(state){
		this.state = state;
		this.emit(state, {
			from: 'app'
		})
	}
} 


export default Application;