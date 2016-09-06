import EventEmitter from 'events';
import {Event, STATES, util} from 'foxman-api';

export default class Application extends EventEmitter {
	constructor() {
		const __ready       = '__ready';
		const __makeFile    = '__makeFile';
		const __serverStart = '__serverStart';

		super();
		this.beforeEventMap = {};
		this.getNextId = util.createSystemId();

		this.scopeMap = {
			__ready,
			__makeFile,
			__serverStart
		}
		this.scopeList = Object.keys(this.scopeMap);
	}

	setConfig(config){
		this.config = config;
	}
	addBeforeEvent (eventName, plugin, fn){
		if(!this.beforeEventMap[eventName]) this.beforeEventMap[eventName] = {};

		this.beforeEventMap[eventName][plugin.id] = {
			name: plugin.name,
			fn: fn
		};
	}

	removeBeforeEvent (eventName, plugin){
		if(
			!this.beforeEventMap[eventName] ||
			!this.beforeEventMap[eventName][plugin.id]
		){
			util.error(`${eventName} is not in our scope list.`);
			return -1;
		}
		try {
			delete this.beforeEventMap[eventName][plugin.id];
		} catch(err) {
			this.beforeEventMap[eventName][plugin.id] = null;
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
				this.use(Plugin.class, Plugin.options);
			});
			return;
		}

		plugin = new Plugins(options);
		Object.assign(plugin, {
			app: this,
			config: this.config,
			name: (plugin.name || plugin.constructor.name),
			id: this.getNextId(),

			on: (msg, fn) => this.on(msg, fn.bind(plugin)),
			emit: (msg, event) => this.call(msg, event),
			before: (scope, fn) => {
				if(!this.scopeMap[scope]) return;
				const prevScope = this.getPrevScope(scope);
				this.on(prevScope, fn);
				this.addBeforeEvent(scope, this, fn);
			},
			complete: event => {
				const nextScope = this.getNextScope(this.scope);
				if(!nextScope) {
					util.error('can`t complete ,because no more scope');
					return;
				}
				const result = this.removeBeforeEvent(nextScope, this);

				if(result===-1){
					util.warnLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete')
				}
				this.afterComplete(nextScope);
			}
		});
		plugin.init && plugin.init();

		plugin.bindLifeCycle = () => {
			this.scopeList.forEach( (item, idx) => {
				const upperEventName = util.firstUpperCase(item.slice(2));
				if( (idx!==0) && plugin[`before${upperEventName}`]){
					plugin.before(item, plugin[`before${upperEventName}`]);
				}
				if(plugin[`on${upperEventName}`]){
					plugin.on(item, plugin[`on${upperEventName}`]);
				}
			});
		};
		plugin.bindLifeCycle();

		util.debugLog(`plugin ${plugin.name || plugin.id} is ready`);
	}

	run(...args) {
		setTimeout(()=>{
			this.setScope(this.scopeMap['__ready']);
		}, 1000);
	}

	on(msg, fn){
		super.on(msg, fn);
	}

	emit(msg ,event){
		super.emit(msg, event);
	}
	getPrevScope(scope){
		return this.scopeList[this.scopeList.indexOf(scope)-1];
	}
	getNextScope(scope){
		 return this.scopeList[this.scopeList.indexOf(scope)+1]
	}
	afterComplete(msg){
		const leaveItemIDs = Object.keys(this.beforeEventMap[msg]||{});
		const leaveItems = leaveItemIDs.map((id)=>{
			return this.beforeEventMap[msg][id].name;
		});
		const leaveItemsLen = leaveItems.length;
		if(leaveItemsLen <= 0){
			this.nextScope();
		} else{
			util.debugLog(`enter ${msg} is wating [${leaveItems.join(',')}],checkout the plugin.complete`);
		}
		return leaveItemsLen<=0;
	}

	nextScope(){
		const nextScope = this.getNextScope(this.scope)
		util.debugLog(`now scope is ${nextScope}`);
		this.setScope(nextScope);
	}

	setScope(scope){
		this.scope = scope;
		this.emit(scope, new Event(scope,'app'));
	}
}
