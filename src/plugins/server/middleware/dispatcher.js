import path from 'path';
import { util, fileUtil } from '../../../helper';

function apiHandler(dispatcher) {
    function isPromise(obj) {
        return 'function' == typeof obj.then;
    }
    if( dispatcher.handler){
        let res = dispatcher.handler(this);
        if(!isPromise(res)){
            res = new Promise((resolve)=>{
                resolve(res);
            });
        }
        return res;
    } else {
        return fileUtil.jsonResolver(dispatcher.dataPath);
    }
}

/**
 * default dispatcher
 * @param  {[type]} dispatcher  [description]
 * @param  {[type]} config [description]
 * @param  {[type]} next [description]
 * @return {[type]}         [description]
 */
export function* dirDispatcher( dispatcher, config, next) {

    const viewPath = dispatcher.path;
    const files = yield fileUtil.getDirInfo( viewPath );
    const promises = files.map( ( file ) => fileUtil.getFileStat( path.resolve( viewPath, file ) ) );
    const result = yield Promise.all(promises);

    const fileList = result.map((item, idx) => {
        return Object.assign(item, {
            name: files[idx],
            isFile: item.isFile(),
            requestPath: [this.request.path, files[idx], item.isFile() ? '' : '/'].join('')
        });
    });

    yield this.render('cataLog', {
        title: '查看列表',
        fileList
    });
}

/**
 * 同步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* syncDispatcher(dispatcher, config, next) {
    const filePath = dispatcher.path;
    let res = yield apiHandler.call(this,dispatcher);

    if( !res || !res.json ) {
      this.type = 500;
      yield this.render('e', { title: '出错了', e:{
        code: 500,
        msg: '请求代理服务器异常'
      }});
      return yield next;
    }

    const output = config.renderUtil().parse( path.relative( config.viewRoot, filePath ), res.json );
    const stderr = output.stderr;
    const stdout = output.stdout;

    let errInfo = [];
    let e = yield new Promise(function ( resolve, reject ){
      stderr.on('data', (chunk)=> {
          errInfo.push(chunk);
      });
      stderr.on('end', () => {
          resolve(errInfo.join(''));
      });
    });

    if( !! e ) {
      yield this.render('e', { title: '出错了', e:{
        code: 500,
        msg: e
      }});
      return yield next;
    }

    let html = yield new Promise(( resolve, reject )=>{
      let html = [];
      if( !stdout.readable ) {
        return resolve(html);
      }
      stdout.on('data',(chunk)=>{
        html.push(chunk);
      });
      stdout.on('end',()=>{
        resolve(html);
      });
    });

    this.type = 'text/html; charset=utf-8';
    this.body = html.join('');
    return yield next;
}

/**
 * 异步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* asyncDispather( dispatcher, config, next) {
    /**
     * 异步接口处理
     * @type {[type]}
     */
    const api = yield apiHandler.call(this,dispatcher);

    if( !api ) {
      yield this.render('e', { title: '出错了', e :{
        code: 500,
        msg: '请求代理服务器异常'
      }});
      return yield next;
    }

    this.type = 'application/json; charset=utf-8';
    this.body = api;

    yield next;
}

export default ( config )=>{

  return function*( next ) {
    /**
     * 分配给不同的处理器
     * @type {Object}
     */
    const request = this.request;
    let args = [config, next];

    let dispatcherMap = {
      'dir': dirDispatcher,
      'sync': syncDispatcher,
      'async': asyncDispather
    };
    util.debugLog(JSON.stringify(this.dispatcher));
    let dispatcher;
    if( dispatcher = dispatcherMap[ this.dispatcher.type ] ){
      yield dispatcher.call(this, this.dispatcher, ...args );
    }
  }
}
