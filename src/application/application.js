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

    run(...args) {
        this.plugins.forEach( plugin => {
            plugin.init && plugin.init();
        });
    }
}
