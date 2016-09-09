import EventEmitter from 'events';
import {
    util
} from '../helper';

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.uid = util.createSystemId();
        this.plugins = [];
    }
    setConfig(config) {
        this.config = config;
    }
    use(plugin) {
        if (Array.isArray(plugin)) return plugin.forEach( this.use.bind(this) );
        this.plugins.push( Object.assign(plugin, {
            app: this,
            name: plugin.constructor.name,
            id: this.uid(),
        }) );
        util.debugLog(`plugin ${plugin.name || plugin.id} is loaded`);
    }
    // before(plugin ,scope, fn){
    //   if (!this.scopeMap[scope]) return;
    //
    //   const prevScope = this.getPrevScope(scope);
    //   this.on(prevScope, fn.bind(plugin));
    //   this.addBeforeEvent(scope, plugin);
    // }
    // complete(plugin){
    //   const nextScope = this.getNextScope(this.scope);
    //   if (!nextScope) {
    //       util.error('can`t complete ,because no more scope');
    //       return;
    //   }
    //
    //   const result = this.removeBeforeEvent(nextScope, plugin);
    //   if (result === -1) {
    //       util.debugLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete')
    //   }
    //   this.afterComplete(nextScope);
    // }
    run(...args) {
        this.plugins.forEach( plugin => {
            plugin.init && plugin.init();
        });
    }
}
