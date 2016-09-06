import EventEmitter from 'events';
import {
    Event,
    STATES,
    util
} from 'foxman-api';

export default class Application extends EventEmitter {
    constructor() {
        const __ready = '__ready';
        const __makeFile = '__makeFile';
        const __serverStart = '__serverStart';

        super();
        this.beforeEventMap = {};
        this.uid = util.createSystemId();
        this.scopeMap = {
            __ready,
            __makeFile,
            __serverStart
        }
        this.scopeList = Object.keys(this.scopeMap);
    }
    setConfig(config) {
        this.config = config;
    }
    addBeforeEvent(eventName, plugin) {
        if (!this.beforeEventMap[eventName]) this.beforeEventMap[eventName] = {};

        this.beforeEventMap[eventName][plugin.id] = plugin.name;
    }
    removeBeforeEvent(eventName, plugin) {
        if (!this.beforeEventMap[eventName] ||
            !this.beforeEventMap[eventName][plugin.id]
        ) {
            util.error(`${eventName} is not in our scope list.`);
            return -1;
        }

        try {
            delete this.beforeEventMap[eventName][plugin.id];
        } catch (e) {}
    }
    use(plugin) {
        if (Array.isArray(plugin)) {
            return plugin.forEach((item) => {
                this.use(item);
            });
        }

        Object.assign(plugin, {
            app: this,
            // config: this.config, /** is it need**/
            name: (plugin.name || plugin.constructor.name),
            id: this.uid(),
            on: (msg, fn) => this.on(msg, fn.bind(plugin)),
            emit: (msg, event) => this.emit(msg, event),
            before: (scope, fn) => this.before(plugin, scope, fn),
            complete: event => this.complete(plugin)
        });
        plugin.init && plugin.init();

        this.bindLifeCycle(plugin);

        util.debugLog(`plugin ${plugin.name || plugin.id} is ready`);
    }
    before(plugin ,scope, fn){
      if (!this.scopeMap[scope]) return;

      const prevScope = this.getPrevScope(scope);
      this.on(prevScope, fn.bind(plugin));
      this.addBeforeEvent(scope, plugin);
    }
    complete(plugin){
      const nextScope = this.getNextScope(this.scope);
      if (!nextScope) {
          util.error('can`t complete ,because no more scope');
          return;
      }

      const result = this.removeBeforeEvent(nextScope, plugin);
      if (result === -1) {
          util.debugLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete')
      }
      this.afterComplete(nextScope);
    }
    bindLifeCycle(plugin) {
        this.scopeList.forEach((item, idx) => {
            const upperEventName = util.firstUpperCase(item.slice(2));
            if ((idx !== 0) && plugin[`before${upperEventName}`]) {
                plugin.before(item, plugin[`before${upperEventName}`]);
            }
            if (plugin[`on${upperEventName}`]) {
                plugin.on(item, plugin[`on${upperEventName}`]);
            }
        });
    };
    run(...args) {
        setTimeout(() => {
            this.setScope(this.scopeMap['__ready']);
        }, 1000);
    }
    on(msg, fn) {
        super.on(msg, fn);
    }
    emit(msg, event) {
        super.emit(msg, event);
    }
    getPrevScope(scope) {
        return this.scopeList[this.scopeList.indexOf(scope) - 1];

    }
    getNextScope(scope) {
        return this.scopeList[this.scopeList.indexOf(scope) + 1]

    }
    afterComplete(msg) {
        const leaveItemIDs = Object.keys(this.beforeEventMap[msg] || {});
        const leaveItems = leaveItemIDs.map((id) => {
            return this.beforeEventMap[msg][id].name;
        });

        const leaveItemsLen = leaveItems.length;
        if (leaveItemsLen <= 0) {
            this.nextScope();
        } else {
            util.debugLog(`enter ${msg} is wating [${leaveItems.join(',')}],checkout the plugin.complete`);
        }
        return leaveItemsLen <= 0;

    }
    nextScope() {
        const nextScope = this.getNextScope(this.scope)
        util.debugLog(`now scope is ${nextScope}`);
        this.setScope(nextScope);
    }
    setScope(scope) {
        this.scope = scope;
        this.emit(scope, new Event(scope, 'app'));
    }
}
