import path from 'path';
import renderUtil from '../../helper/render';
import { util, fileUtil } from '../../helper';

/**
 * default dispatcher
 * @param  {[type]} config  [description]
 * @param  {[type]} this [description]
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

export function* syncDispatcher(dispatcher, config, next) {

    const filePath = dispatcher.path;
    const dataPath = dispatcher.dataPath;
    const dataModel = yield fileUtil.jsonResover(dataPath);

    if( !dataModel ) {
      this.type = 500;
      return yield this.render('e', { title: '出错了', e:{
        code: 500,
        msg: '请求代理服务器异常'
      }});
    }

    const output = config.renderUtil().parse( path.relative( config.viewRoot, filePath ), dataModel );
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

    let html = [];
    yield new Promise(( resolve, reject )=>{
      stdout.on('data',(chunk)=>{
        html.push(chunk);
      });
      stdout.on('end',()=>{
        resolve(html);
      });
    });

    this.type = 'text/html; charset=utf-8';
    this.body = html.join('');
}

export function* asyncDispather( dispatcher, config, next) {
    /**
     * 异步接口处理
     * @type {[type]}
     */
    const asyncDataPath = dispatcher.dataPath;
    const api = yield fileUtil.jsonResover(asyncDataPath);
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
    const url = request.path;
    let args = [config, next];

    let dispatcherMap = {
      'dir': dirDispatcher,
      'sync': syncDispatcher,
      'async': asyncDispather,
    }

    let dispatcher;
    if( dispatcher = dispatcherMap[ this.dispatcher.type ] ){
      yield dispatcher.call(this, this.dispatcher, ...args );
    }
  }
}
