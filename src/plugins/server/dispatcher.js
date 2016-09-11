import path from 'path';
import renderUtil from '../../helper/render';
import { util, fileUtil } from '../../helper';

/**
 * default dispatcher
 * @param  {[type]} config  [description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
export function* dirDispatcher( dispatcher, config, context, next) {

    const viewPath = path.join( config.viewRoot, dispatcher.path );
    const files = yield fileUtil.getDirInfo( viewPath );
    const promises = files.map( ( file ) => fileUtil.getFileStat( path.resolve( viewPath, file ) ) );
    const result = yield Promise.all(promises);

    const fileList = result.map((item, idx) => {
        return Object.assign(item, {
            name: files[idx],
            isFile: item.isFile(),
            requestPath: [dispatcher.path, files[idx], item.isFile() ? '' : '/'].join('')
        });
    });

    yield context.render('cataLog', {
        title: '查看列表',
        fileList
    });
}

export function* syncDispatcher(dispatcher, config, context, next) {
    const filePath = path.join( config.viewRoot, dispatcher.path );
    const dataPath = dispatcher.dataPath;
    let dataModel = {};
    try {
        dataModel = yield fileUtil.jsonResover(dataPath);
        console.log(dataModel);
    } catch (err) {
        util.warnLog(`${dataPath} is not found!`);
    }

    const output = config.renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);

    let errInfo = Buffer.alloc(0);
    yield new Promise(( resolve, reject )=>{
      output.stderr.on('data', (chunk)=> {
          errInfo = util.bufferConcat(errInfo, Buffer.from(chunk))
      });
      output.stderr.on('end', ()=> {
          if( errInfo.length != 0 ){
            util.warnLog(errInfo.toString('utf-8').red);

            context.type = 'text/plain; charset=utf-8';
            context.status = 500;

            context.body = errInfo ;
          }
          resolve();
      });
    });

    if( errInfo.length == 0 ){
      let htmlBuf = Buffer.alloc(0);
      yield new Promise(( resolve, reject )=>{
        output.stdout.on('data',(chunk)=>{
          htmlBuf = util.bufferConcat(htmlBuf, chunk);
        });
        output.stdout.on('end',()=>{

          context.type = 'text/html; charset=utf-8';
          context.body = htmlBuf;

          resolve();
        });
      });
    }

    yield next;
}

export function* asyncDispather( dispatcher, config, context, next) {
    /**
     * 异步接口处理
     * @type {[type]}
     */
    const asyncDataPath = dispatcher.dataPath;
    const filePath = path.join(config.asyncData, asyncDataPath);
    const api = fileUtil.getFileByStream(filePath);

    context.type = 'application/json; charset=utf-8';
    context.body = api;

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
    let args = [config, this, next];

    let dispatcherMap = {
      'dir': dirDispatcher,
      'sync': syncDispatcher,
      'async': asyncDispather
    }
    let dispatcher;
    if( dispatcher = dispatcherMap[ this.dispatcher.type ] ){
      yield dispatcher( this.dispatcher, ...args );
    }
    // for (let dispatcher of dispatcherMap) {
    //     if (dispatcher.test()) {
    //         return yield dispatcher.handler();
    //     }
    // }
  }
}
