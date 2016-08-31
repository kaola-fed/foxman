import EventEmitter from 'events';
import {Event, STATES} from 'foxman-api';
import {firstUpperCase, error, log, debugLog, warnLog} from '../util/util';

let app;
class Application extends EventEmitter{
	constructor() {
		super();
		this.beforeEventMap = {};
		this.current = 0;
		this.states = STATES ; //['ready', 'create', 'startServer', 'serverBuild'];
	}

	addBeforeEvent (eventName, plugin, fn){
		if(!app.beforeEventMap[eventName]) app.beforeEventMap[eventName] = {};
		app.beforeEventMap[eventName][plugin.id] = {
			name: plugin.name,
			fn: fn
		};
	}

	removeBeforeEvent (eventName, plugin){
		try{
			delete app.beforeEventMap[eventName][plugin.id];
		}catch(err){
			app.beforeEventMap[eventName][plugin.id] = null;
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
			on(msg, fn) {
				app.on(msg, fn.bind(plugin));
			},
			emit(msg, event) {
				app.call(msg, event);
			},
			before(state, fn) {
				if(!(~app.states.indexOf(state))) return;
				const prevState = app.states[app.states.indexOf(state)-1];
				this.on(prevState, fn);
				app.addBeforeEvent(state, this, fn);
			},
			complete(event) {
				const nextState = app.states[app.states.indexOf(app.state)+1];
				if(!nextState) {
					error('can`t complete ,because no more state');
					return;
				}
				app.removeBeforeEvent(nextState, this);
				app.afterComplete(nextState);
			}
		});

		plugin.app = app;

		plugin.name = plugin.name || plugin.constructor.name;
		plugin.id = app.current++;

		plugin.bindLifeCircle = () => {
			app.states.forEach( (item, idx) => {
				const upperEventName = firstUpperCase(item);

				if( (idx!==0) && plugin[`before${upperEventName}`]){
					plugin.before(item, plugin[`before${upperEventName}`]);
				}
				if(plugin[`on${upperEventName}`]){
					plugin.on(item, plugin[`on${upperEventName}`]);
				}
			});
		};
		plugin.bindLifeCircle();

		debugLog(`插件 ${plugin.name || plugin.id} 装载完毕`);
	}

	run(...args) {
		setTimeout(()=>{
			app.setState(app.states[0]);
		}, 1000);
	}

	on(msg, fn){
		super.on(msg, fn);
	}

	emit(msg ,event){
		super.emit(msg, event);
	}

	afterComplete(msg){
		const leaveItemIDs = Object.keys(app.beforeEventMap[msg]||{});
		const leaveItems = leaveItemIDs.map((id)=>{
			return app.beforeEventMap[msg][id].name;
		});
		const leaveItemsLen = leaveItems.length;

		if(leaveItemsLen <= 0){
			app.nextState();
		} else{
			debugLog(`进入 ${msg} 阶段还需要插件 [${leaveItems.join(',')}] 准备完毕`);
		}
		return leaveItemsLen<=0;
	}

	static nextState(){
		const nextState = app.states[app.states.indexOf(app.state)+1];
		debugLog(`进入 ${nextState} 阶段`);
		app.setState(nextState);
	}

	static setState(state){
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
