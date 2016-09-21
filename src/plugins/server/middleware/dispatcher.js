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
        return fileUtil.jsonResolver({url: dispatcher.dataPath});
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
    console.time('dir');
    const viewPath = dispatcher.path;
    const files = yield fileUtil.getDirInfo( viewPath );
    console.timeEnd('dir');
    console.time('dir1');

    const promises = files.map( ( file ) => fileUtil.getFileStat( path.resolve( viewPath, file ) ) );
    const result = yield Promise.all(promises);
    console.timeEnd('dir1');

    const fileList = result.map((item, idx) => {
        return Object.assign(item, {
            name: files[idx],
            isFile: item.isFile(),
            requestPath: [this.request.path, files[idx], item.isFile() ? '' : '/'].join('')
        });
    });
    console.time('dir2');
    yield this.render('cataLog', {
        title: '查看列表',
        fileList
    });
    console.timeEnd('dir2');
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
        msg: '数据处理异常'
      }});
      return yield next;
    }
    const output = yield config.tplRender.parse( path.relative( config.viewRoot, filePath ), res.json );
    if(/DONE/ig.test(output.out)){
        this.type = 'text/html; charset=utf-8';
        this.body = output.data;
        return yield next;
    }
    yield this.render('e', { title: '出错了', e:{
        code: 500,
        msg: output.out
    }});
    return yield next;
}

/**
 * 异步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* asyncDispather(dispatcher, config, next) {
    /**
     * 异步接口处理
     * @type {[type]}
     */
    let res = yield apiHandler.call(this, dispatcher);
    if (res && res.json) {
        this.type = 'application/json; charset=utf-8';
        this.body = res.json;
        return yield next;
    }
    yield this.render('e', {
        title: '出错了', e: {
            code: 500,
            msg: '请求代理服务器异常'
        }
    });
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
    util.log(`type: ${this.dispatcher.type} path: ${this.dispatcher.path||this.dispatcher.dataPath}`);
    let dispatcher;
    if( dispatcher = dispatcherMap[ this.dispatcher.type ] ){
      yield dispatcher.call(this, this.dispatcher, ...args );
    }
  }
}
