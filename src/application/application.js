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
            async: (...args) => this.async.apply(plugin, args )
        }));
        util.debugLog(`plugin ${plugin.name || plugin.id} is loaded`);
    }

    async( fn ){
      let pending = new Promise((resolve)=>{ return fn( resolve ) });

      if( this.pendings ){
        return this.pendings.push(pending);
      }

      this.pendings = [ pending ];
    }

    excute(){
      return function * ( crt = 0 ) {
        const plugins = this.plugins;
        for( let plugin of plugins ){
          plugin.init && plugin.init();
          if( plugin.pendings ){
              yield Promise.all(plugin.pendings);
          }
        }
      }
    }

    run() {
        let pipeline = this.excute().call(this);
        let final = {};
        while( !final.done ){
          final = pipeline.next();
        }
    }
}
