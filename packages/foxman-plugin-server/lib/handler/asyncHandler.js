const apiHandler = require('@foxman/helpers/lib/apiHandler');

// asyncHandler
module.exports = function* asyncHandler({dispatcher, next}) {
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

    this.type = 'application/json; charset=utf-8';
    this.body = json;
    return yield next;
};