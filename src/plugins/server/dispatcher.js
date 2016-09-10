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
export function* dirDispatcher(url, config, context) {

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

export function* ftlDispatcher(url, config, context) {
    const filePath = path.join(config.viewRoot, url);
    const dataPath = filePath.replace(config.viewRoot, config.syncData).replace(/.ftl$/, '.json')

    let dataModel = {};
    try {
        dataModel = require(dataPath);
    } catch (err) {
        util.warnLog(`${dataPath} is not found!`);
    }
    const output = renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);

    context.type = 'text/html; charset=utf-8';
    context.body = output.stdout || output.stderr;

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
}

export function* jsonDispatcher(url, config, context) {
    const filePath = path.join(config.root, url);
    const dataPath = filePath.replace(config.viewRoot, config.asyncData)
    const json = fileUtil.getFileByStream(dataPath);

    context.type = 'application/json; charset=utf-8';
    context.body = json;
}

export default ( config )=>{
  return function*() {
    const url = this.request.handledPath || this.request.path;

    const routeMap = {
        '/':     dirDispatcher,
        '.ftl':  ftlDispatcher,
        '.json': jsonDispatcher
    };

    for (let route of Object.keys(routeMap)) {
        if (url.endsWith(route)) {
            yield routeMap[route](url, config, this);
            return;
        }
    }
  }
}
