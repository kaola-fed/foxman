import EventEmitter from 'events';
import {resolve} from 'path';
import {Event, STATES} from 'foxman-api';
import chokidar from 'chokidar';
import anymatch from 'anymatch';
import {firstUpperCase,
				error,
				log,
				debugLog,
				warnLog
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
	on(...args){
		if( Array.isArray(args[1]) ) {
			return args[1].forEach( (path,idx) => {
				this.on(args[0], path, args[2]);
			});
		}
		let absPath = resolve(this.root, args[1]);
		debugLog(`watch File: ${args[0]}:${ absPath }`);

    if( args.length < 3 ) return;
		let matcher = anymatch(absPath);

		let testFunc = ( path ,stats) => {
      if( matcher(path) ) {
				debugLog(`watcher's event is ${args[0]},file is ${path}`);
				return args[2](path, stats);
			}
    };

		this.watcher.on(args[0], testFunc);
	}
	onControl(...args){
		this.on.apply(this,['add',...args]);
	}
  onChange(...args){
		this.on.apply(this,['add',...args]);
		this.on.apply(this,['change',...args]);
		this.on.apply(this,['unlink',...args]);
  }
}
export default function (...args) {
  if(!watcher) watcher = new Watcher(...args);
  return watcher;
};
