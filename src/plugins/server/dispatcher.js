import path from 'path';
import renderUtil from '../../helper/render';
import {
    util,
    fileUtil
} from '../../helper';

export function* dirDispatcher(url, config, context) {

    const viewPath = path.join(config.root, url);
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
    const filePath = path.join(config.root, url);
    const dataPath = filePath.replace(config.viewRoot, config.syncData).replace(/.ftl$/, '.json')

    let dataModel = {};
    try {
        dataModel = require(dataPath);
    } catch (err) {
        util.warnLog(`${dataPath} is not found!`);
    }
    const output = renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);

    context.type = 'text/html; charset=utf-8';
    context.body = output.stdout;

    const errInfo = [];
    output.stderr.on('data', function(chunk) {
        errInfo.push(chunk);
    });
    output.stderr.on('end', function() {
        console.log(errInfo.join(''));
    });
}

export function* jsonDispatcher(url, config, context) {
    const filePath = path.join(config.root, url);
    const dataPath = filePath.replace(config.viewRoot, config.asyncData)
    const json = fileUtil.getFileByStream(dataPath);

    context.type = 'application/json; charset=utf-8';
    context.body = json;
}
