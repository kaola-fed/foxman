import path from 'path';
import renderUtil from '../../helper/render';
import {
    util,
    fileUtil
} from '../../helper';

/**
 * default dispatcher
 * @param  {[type]} url     [description]
 * @param  {[type]} config  [description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
export function* dirDispatcher(url, config, context, next) {

    const viewPath = path.join( config.viewRoot, url);
    const files = yield fileUtil.getDirInfo(viewPath);
    const promises = files.map((file) => {
        return fileUtil.getFileStat(path.resolve(viewPath, file))
    });
    const result = yield Promise.all(promises);
    const fileList = result.map((item, idx) => {
        return Object.assign(item, {
            name: files[idx],
            isFile: item.isFile(),
            url: [url, files[idx], item.isFile() ? '' : '/'].join('')
        });
    });

    yield context.render('cataLog', {
        title: '查看列表',
        fileList
    });
}

export function* ftlDispatcher( url, config, context ,next) {
    const filePath = path.join( config.viewRoot, url );

    const dataPath = ( config.dataMatch ) ?
     config.dataMatch( url.replace(/^(\/||\\)/,'').replace(/\.[^.]*$/, '')) :
     path.join( config.syncData ,url.replace( /\.[^.]*$/, '.json' ));

    let dataModel = {};
    try {
        dataModel = require(dataPath);
    } catch (err) {
        util.warnLog(`${dataPath} is not found!`);
    }

    let output = config.renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);
    let html = [];
    yield new Promise( ( resolve, reject )=>{
      output.stdout.on('data',(chunk)=>{
        html.push(chunk);
      });
      output.stdout.on('end',()=>{
        if(html){
          context.type = 'text/html; charset=utf-8';
          context.body = html.join('');
          return resolve();
        }
        reject();
      });
    })


    const errInfo = [];

    output.stderr.on('data', (chunk)=> {
        errInfo.push(chunk);
    });
    output.stderr.on('end', ()=> {
        let err = errInfo.join('');
        if( err ){ console.log(err); }
        // console.log(context);
        // context.body = err;
    });

    yield next;
}


export function* jsonDispatcher(url, config, context, next) {
    const filePath = path.join(config.asyncData, url);
    const json = fileUtil.getFileByStream(filePath);

    context.type = 'application/json; charset=utf-8';
    context.body = json;

    yield next;
}

export default ( config )=>{
  return function*( next ) {
    const url = this.request.pagePath || this.request.path;

    const routeMap = {
        '/':     dirDispatcher,
        [ '.' + config.extension ]:  ftlDispatcher,
        '.json': jsonDispatcher
    };

    for (let route of Object.keys(routeMap)) {
        if (url.endsWith(route)) {
            yield routeMap[route](url, config, this, next);
            return;
        }
    }
  }
}
