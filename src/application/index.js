import EventEmitter from 'events';
import {Event, STATES} from 'foxman-api';
import {firstUpperCase,
				error,
				log,
				debugLog,
				warnLog,
				createSystemId
			} from '../util/util';

let app;
class Application extends EventEmitter{
	constructor() {
		let __ready       = '__ready';
		// let __setConfig   = '__setConfig';
		// let __loadPlugins = '__loadPlugins';
		let __makeFile    = '__makeFile';
		let __serverStart = '__serverStart';

		super();
		this.beforeEventMap = {};
		this.getNextId = createSystemId();
		// __setConfig,
		// __loadPlugins,
		this.scopeMap = {
			__ready,
			__makeFile,
			__serverStart
		}
		this.scopeList = Object.keys(this.scopeMap);
		console.log(this.scopeList);
	}

	setConfig(config){
		app.config = config;
	}
	addBeforeEvent (eventName, plugin, fn){
		if(!app.beforeEventMap[eventName]) app.beforeEventMap[eventName] = {};

		app.beforeEventMap[eventName][plugin.id] = {
			name: plugin.name,
			fn: fn
		};
	}

	removeBeforeEvent (eventName, plugin){

		if(!app.beforeEventMap[eventName] || !app.beforeEventMap[eventName][plugin.id]){
			error(`${eventName} is not in our scope list.`);
			return -1;
		}
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
			app:		app,
			config: app.config,
			name: 	(plugin.name || plugin.constructor.name),
			id: 		app.getNextId(),

			on(msg, fn) {
				app.on(msg, fn.bind(plugin));
			},
			emit(msg, event) {
				app.call(msg, event);
			},
			before(scope, fn) {
				if(!app.scopeMap[scope]) return;
				const prevScope = app.getPrevScope(scope);
				this.on(prevScope, fn);
				app.addBeforeEvent(scope, this, fn);
			},
			complete(event) {
				const nextScope = app.getNextScope(app.scope);
				if(!nextScope) {
					error('can`t complete ,because no more scope');
					return;
				}
				var result = app.removeBeforeEvent(nextScope, this);

				if(result===-1){
					warnLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete')
				}
				app.afterComplete(nextScope);
			}
		});
		plugin.init && plugin.init();
		// plugin.app = app;

		plugin.bindLifeCircle = () => {
			app.scopeList.forEach( (item, idx) => {
				const upperEventName = firstUpperCase(item.slice(2));
				if( (idx!==0) && plugin[`before${upperEventName}`]){
					plugin.before(item, plugin[`before${upperEventName}`]);
				}
				if(plugin[`on${upperEventName}`]){
					plugin.on(item, plugin[`on${upperEventName}`]);
				}
			});
		};
		plugin.bindLifeCircle();

		debugLog(`plugin ${plugin.name || plugin.id} is ready`);
	}

	run(...args) {
		setTimeout(()=>{
			app.setScope(app.scopeMap['__ready']);
		}, 1000);
	}

	on(msg, fn){
		super.on(msg, fn);
	}

	emit(msg ,event){
		super.emit(msg, event);
	}
	getPrevScope(scope){
		return app.scopeList[app.scopeList.indexOf(scope)-1];
	}
	getNextScope(scope){
		 return app.scopeList[app.scopeList.indexOf(scope)+1]
	}
	afterComplete(msg){
		const leaveItemIDs = Object.keys(app.beforeEventMap[msg]||{});
		const leaveItems = leaveItemIDs.map((id)=>{
			return app.beforeEventMap[msg][id].name;
		});
		const leaveItemsLen = leaveItems.length;
		if(leaveItemsLen <= 0){
			app.nextScope();
		} else{
			debugLog(`enter ${msg} is wating [${leaveItems.join(',')}],checkout the plugin.complete`);
		}
		return leaveItemsLen<=0;
	}

	nextScope(){
		const nextScope = app.getNextScope(app.scope)
		debugLog(`now scope is ${nextScope}`);
		app.setScope(nextScope);
	}

	setScope(scope){
		app.scope = scope;
		app.emit(scope, new Event(scope,'app'));
	}
}

export default function () {
	if(!app){
		app = new Application();
	}
	return app;
}
