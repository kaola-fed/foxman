const { system, consts, JSON } = require('@foxman/helpers');
const fetch = require('../fetch');
const { SYNC } = consts.DispatherTypes;

module.exports = ({ viewEngine }) => {
    return function*(next) {
        const dispatcher = this.dispatcher;

        if (!dispatcher || dispatcher.type !== SYNC) {
            return yield next;
        }

        const filePath = dispatcher.pagePath;
        let json;

        try {
            json = (yield fetch.call(this, dispatcher)).json;
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
            this.body += `<script type="text/javascript"> window.__FOXMAN_SYNC_DATA__ = ${JSON.stringify(json)} </script>`;
        } catch (msg) {
            system.notify({
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
