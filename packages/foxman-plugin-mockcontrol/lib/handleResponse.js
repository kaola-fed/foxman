let { typer, path, generator } = require('@foxman/helpers');

module.exports = function * handleResponse({handler, responseData: responseDataRaw, scriptPath}) {
    let responseData, message;
    const request = this.request;
    
    // type: generator，拥有完整的 koa context
    if (generator.isGenerator(handler)) {
        try {
            responseData = yield handler.call(this, responseDataRaw, request);
        } catch (e) {
            message = `Error from generator ${path.shorten(scriptPath)}:\n ${e.stack || e}`;
        }
    // type: function，
    } else if (typer.typeOf(handler) === 'function') {
        try {
            responseData = handler(responseDataRaw, request) || responseDataRaw;
        } catch (e) {
            message = `Error from function ${path.shorten(scriptPath)}:\n ${e.stack || e}`;
        }
    }
    return {responseData, message};
};