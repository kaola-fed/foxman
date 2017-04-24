const fetch = require('../fetch');
const { consts } = require('@foxman/helpers');
const { ASYNC } = consts.DispatherTypes;

// asyncHandler
module.exports = () => {
    return function*(next) {
        const dispatcher = this.dispatcher;

        if (!dispatcher || dispatcher.type !== ASYNC) {
            return yield next;
        }

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

        this.type = 'application/json; charset=utf-8';
        this.body = json;
        return yield next;
    };
};
