import EventEmitter from 'events';
import {Event} from 'foxman-api';
import {firstUpperCase, error} from '../util/util';

let app;
class Application {
	constructor() {
		this.eventEmitter = new EventEmitter();
		this.beforeEventMap = {};
		this.current = 0;
		this.states = ['ready', 'create', 'startServer', 'serverBuild'];
	}

	addBeforeEvent (eventName, pluginId, fn){
		if(!app.beforeEventMap[eventName]) app.beforeEventMap[eventName] = {};
		app.beforeEventMap[eventName][pluginId] = fn;
	}

	removeBeforeEvent (eventName, pluginId){
		try{
				delete app.beforeEventMap[eventName][pluginId];
		}catch(err){
			app.beforeEventMap[eventName][pluginId] = null;
		}
	}

	use(Plugins, options) {
		let plugin;
		if(Array.isArray(Plugins) && !options){
			Plugins.forEach((Plugin)=>{
				if(Array.isArray(Plugin)){
					Plugin = Object.assign({},{
						class: Plugin[0],
						options: Plugin[1]
					})
				}
				app.use(Plugin.class, Plugin.options);
			});
			return;
		}

		plugin = new Plugins(options);
		Object.assign(plugin, {
			on: app.on,
			emit: app.emit,
			before: app.before,
			complete: app.complete
		});

		plugin.app = app;
		plugin.id = app.current++;
		plugin.bindLifeCircle = () => {
			app.states.forEach( (item, idx) => {
				const upperEventName = firstUpperCase(item);

				if( (idx!==0) && plugin['before' + upperEventName]){
					plugin.before(item, plugin[`before${upperEventName}`].bind(plugin));
				}
				if(plugin['on' + upperEventName]){
					plugin.on(item, plugin[`on${upperEventName}`].bind(plugin));
				}
			});
		}
		plugin.bindLifeCircle();
	}

	run(...args) {
		setTimeout(()=>{
			app.setState(app.states[0]);
		}, 1000);
	}

	on(msg, fn){
		app.eventEmitter.on(msg, fn);
	}

	before(state, fn){
		if(!(~app.states.indexOf(state))) return;
		// console.log(state);

		const prevState = app.states[app.states.indexOf(state)-1];
		app.eventEmitter.on(prevState, fn);
		app.addBeforeEvent(state, this.id, fn);
	}

	emit(msg ,event){
		app.eventEmitter.emit( msg, event);
	}

	complete(event){
		const nextState = app.states[app.states.indexOf(app.state)+1];

		if(!nextState) {
			error('can`t complete ,because no more state');
			return;
		}
		app.removeBeforeEvent(nextState, this.id);
		app.afterComplete(nextState);
	}

	afterComplete(msg){
		const len = Object.keys(app.beforeEventMap[msg]||{}).length;
		if(len <= 0){
			app.nextState();
		}
	}

	nextState(){
		const nextState = app.states[app.states.indexOf(app.state)+1];
		app.setState(nextState);
	}

	setState(state){
		app.state = state;
		app.emit(state, new Event(state,'app'));
	}
}

export default function () {
	if(!app){
		app = new Application();
	}
	return app;
}
