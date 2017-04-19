const apiHandler = require('../utils/apiHandler');
const {util: _} = require('@foxman/helpers');
const {consts} = require('@foxman/helpers');
const {SYNC} = consts.DispatherTypes;

module.exports = ({viewEngine}) => {
    return function*(next) {
        const dispatcher = this.dispatcher;

        if (!dispatcher || 
            (dispatcher.type !== SYNC)) {
            return yield next;
        }

        const filePath = dispatcher.pagePath;
        let json;

        try {
            json = (yield apiHandler.call(this, dispatcher)).json;
        } catch (msg) {
            this.type = 500;

            yield this.render('e', {
                title: '出错了',
                e: {
                    code: 500,
                    msg: msg.stack || msg
                }
            });

            return yield next;
        }

        try {
            let result = yield viewEngine.parse(filePath, json);
            this.type = 'text/html; charset=utf-8';
            this.body = result;
        } catch (msg) {
            _.notify({
                title: '模板解析失败',
                msg: msg.stack || msg
            });
            yield this.render('e', {
                title: '出错了',
                e: {
                    code: 500,
                    msg: msg.stack || msg
                }
            });
        }

        return yield next;
    };
};