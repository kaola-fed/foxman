import EventEmitter from 'events';
import injector from './injector';
import {
    util
} from '../helper';

export default class Application extends EventEmitter {
  constructor() {
    super();
    this.uid = util.createSystemId();
    this.plugins = [];
  }

  setConfig( config ) {
    this.config = config;
  }

  use( plugin ) {
    if (Array.isArray(plugin)) return plugin.forEach( this.use.bind(this) );
    this.plugins.push( Object.assign(plugin, {
      config: this.config,
      name: plugin.constructor.name,
      id: this.uid(),
      pending: (...args) => this.pending.apply(plugin, args )
    }) );
    
    injector.register( util.initialsLower( plugin.name ), plugin );

    util.debugLog(`plugin ${plugin.name || plugin.id} is loaded`);
  }

  pending( fn ) {
    let pending = new Promise( (resolve)=>{ return fn( resolve ) });

    if( this.pendings ){
      return this.pendings.push(pending);
    }
    this.pendings = [ pending ];
  }

  excute(){
    return function * () {
      const plugins = this.plugins;
      for( let plugin of plugins ){
        plugin.init && injector.resolve( plugin.init, plugin );
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
