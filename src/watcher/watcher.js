import EventEmitter from 'events';
import {Event, STATES} from 'foxman-api';
import chokidar from 'chokidar';
import anymatch from 'anymatch';
import _ from 'underscore';
import {firstUpperCase,
				error,
				log,
				debugLog,
				warnLog,
				createSystemId
			} from '../util/util';

let watcher;
class Watcher {
  constructor(...args){
    this.root = args[0];
    this.watcher = chokidar.watch(this.root, {
      ignored: /node_modules/,
      persistent: true
    });
  }
  onChange(...args){
    debugLog(`watch Directory: ${this.root + args[0]}`);
    if( args.length < 2 ) return;
    let testFunc = ( path ,stats) => {
      if( matcher(path) ) return args[args.length-1](path, stats);
    };
    let matcher = anymatch( this.root + args[0]);

    if(args.length == 2){
      debugLog(`watcher's arguments len is 2, is using all`)
      this.watcher.on('change', testFunc);
    }

  }
}
export default function (...args) {
  if(!watcher) watcher = new Watcher(...args);
  return watcher;
};
