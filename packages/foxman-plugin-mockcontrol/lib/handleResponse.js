let { typer, path, generator } = require('@foxman/helpers');

module.exports = function * handleResponse({handler, responseData: responseDataRaw, scriptPath}) {
    let responseData, message;
    const request = this.request;
    const [isGenerator, isFunction] = [generator.isGenerator(handler), typer.typeOf(handler) === 'function'];
    
    // 拥有完整的 koa context
    if (isGenerator || isFunction) {
        try {
            responseData = handler.call(this, responseDataRaw, request);

            if (isGenerator) {
                responseData = yield responseData;
            }
        } catch (e) {
            message = `Error from javascript ${path.shorten(scriptPath)}:\n ${e.stack || e}`;
        }
    } 
    return {responseData, message};
};