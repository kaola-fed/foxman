import path from 'path';
import {fileUtil, util, DispatherTypes} from '../../../helper';
import apiHandler from '../../../helper/apiHandler';

/**
 * default dispatcher
 * @param  {[type]} dispatcher  [description]
 * @param  {[type]} config [description]
 * @param  {[type]} next [description]
 * @return {[type]}         [description]
 */
export function* dirDispatcher({
    dispatcher, next
}) {
    const sortFiles = (list) => {
        return list.sort((a, b) => {
            return a.name.charAt(0).localeCompare(b.name.charAt(0));
        });
    };
    const viewPath = dispatcher.pagePath;
    const files = yield fileUtil.getDirInfo(viewPath);
    const promises = files.map((file) => fileUtil.getFileStat(path.resolve(viewPath, file)));
    let result = (yield Promise.all(promises)).map((item, idx) => {
        return Object.assign(item, {
            name: files[idx],
            isFile: item.isFile(),
            requestPath: [this.request.path, files[idx], item.isFile() ? '' : '/'].join('')
        });
    });

    const fileList = sortFiles(result.filter((item) => {
        return item.isFile;
    }));
    const dirList = sortFiles(result.filter((item) => {
        return !item.isFile;
    }));

    yield this.render('cataLog', {
        title: '查看列表',
        showList: dirList.concat(fileList)
    });
    yield next;
}

/**
 * 同步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* syncDispatcher({
    dispatcher, tplRender, next
}) {
    const filePath = dispatcher.pagePath;
    let json;

    try {
        json = (yield apiHandler.call(this, dispatcher)).json;
    } catch (msg) {
        this.type = 500;

        yield this.render('e', {
            title: '出错了', e: {
                code: 500,
                msg: msg.stack || msg
            }
        });
        
        return yield next;
    }


    try {
        let result = yield tplRender.parse(filePath, json);
        this.type = 'text/html; charset=utf-8';
        this.body = result;
    } catch (msg) {
        util.notify({
            title: '模板解析失败',
            msg: msg.stack || msg
        });
        yield this.render('e', {
            title: '出错了', e: {
                code: 500,
                msg: msg.stack || msg
            }
        });
    }

    return yield next;
}

/**
 * 异步请求响应
 * @param dispatcher
 * @param config
 * @param next
 * @returns {*}
 */
export function* asyncDispather({
    dispatcher, tplRender, next
}) {
    /**
     * 异步接口处理
     * @type {[type]}
     */
    let json;

    try {
        json = (yield apiHandler.call(this, dispatcher)).json;
    } catch (msg) {
        this.type = 500;

        yield this.render('e', {
            title: '出错了', e: {
                code: 500,
                msg: msg.stack || msg
            }
        });
        return yield next;
    }

    this.type = 'application/json; charset=utf-8';
    this.body = json;
    return yield next;
}

export default ({tplRender}) => {
    return function*(next) {
        const {dispatcher = false} = this;

        if (!dispatcher) {
            return yield next;
        }

        /**
         * 分配给不同的处理器
         * @type {Object}
         */
        let args = {tplRender, next};

        let dispatcherMap = {
            [DispatherTypes.DIR]: dirDispatcher,
            [DispatherTypes.SYNC]: syncDispatcher,
            [DispatherTypes.ASYNC]: asyncDispather
        };

        let handler = dispatcherMap[dispatcher.type];

        if (handler) {
            return yield handler.call(this, Object.assign({dispatcher}, args));
        }
        
        yield next;
    };
};
