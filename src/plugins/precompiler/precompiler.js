/**
 * 预处理器 api，用于
 */
import {resolve} from 'path';
import {
  fileUtil,
  util
} from  '../../helper';

import vinylFs from 'vinyl-fs';
import EventEmitter from 'events';

class PreCompiler extends EventEmitter{
  constructor(options) {
    super();
    Object.assign(this, options);
  }
  pipe(...args){
    // console.log(args);
    this.source = this.source.pipe.apply(this.source,args);
    Object.assign(args[0], EventEmitter.prototype);
    args[0].on('returnDependencys', (event) => {
      return this.emit('updateWatch', event);
    });

    return this;
  }
  dest(arg1){

    return vinylFs.dest.call(vinylFs, resolve(this.root, arg1));
  }
  update(){
    this.source = vinylFs.src(this.filename);
    this.handler( this.dest.bind(this) ).forEach( (item) => { this.pipe(item); });
  }
  run(){
    this.update();
  }
}
export default PreCompiler;
