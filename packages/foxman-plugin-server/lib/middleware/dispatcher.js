const {dirHandler, syncHandler, asyncHandler} = require('../handler');
const {consts} = require('@foxman/helpers');
const {DIR, SYNC, ASYNC} = consts.DispatherTypes;

function getHandler(type) {
    const dispatcherMap = {
        [DIR]: dirHandler,
        [SYNC]: syncHandler,
        [ASYNC]: asyncHandler
    };
    return dispatcherMap[type];
}

module.exports = ({viewEngine}) => {
    return function*(next) {
        const {dispatcher = false} = this;
        if (!dispatcher) {
            return yield next;
        }
        /**
         * 分配给不同的处理器
         * @type {Object}
         */
        let args = {viewEngine, next};
        let handler = getHandler(dispatcher.type);
        
        if (handler) {
            return yield handler.call(this, Object.assign({dispatcher}, args));
        }
        yield next;
    };
};
