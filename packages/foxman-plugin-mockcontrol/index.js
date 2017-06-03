let { typer, logger, path } = require('@foxman/helpers');
const ensureResponseData = require('./lib/ensureResponseData');
const getHandler = require('./lib/getHandler');
const getJSON = require('./lib/getJSON');
const handleResponse = require('./lib/handleResponse');

logger = logger.createLogger('mock-control');

function MockControl(options) {
    this.mapJS =
        options.mapJS ||
        function(dataPath) {
            return dataPath.replace(/\.json$/, '.js');
        };
}

MockControl.prototype.init = function({ getter, service }) {
    if (getter('proxy.enable'))
        return;

    const self = this;
    service('server.use')(
        () => function*(next) {
            const dispatcher = this.dispatcher;
            if (!dispatcher || dispatcher.type === 'dir') 
                return yield next;

            const dataPath = ensureItem(dispatcher.dataPath);
            const scriptPath = self.mapJS(dataPath);

            if (typer.typeOf(dataPath) === 'undefined')
                return yield next;

            let handleResponseMessage;
            let {hasJson, parsedData, message: getJSONMessage} = yield getJSON(dataPath);
            let {hasJs, handler, message: getHandlerMessage} = yield getHandler(scriptPath);
            let responseData = ensureResponseData({hasJson, parsedData});

            if (hasJs)
                ({responseData, message: handleResponseMessage} = yield handleResponse.call(this, {handler, responseData, scriptPath}));
            
            else if (!hasJson)
                getJSONMessage = `File ${path.shorten(dataPath)} is not found!`;

            const message = getJSONMessage || getHandlerMessage || handleResponseMessage;

            if (message) 
                logger.error(message);

            if (!responseData)
                return;

            dispatcher.handler = () => Promise.resolve(responseData);

            yield next;
        }
    );
};

function ensureItem(item) {
    return Array.isArray(item) ? item[item.length - 1] : item;
}

module.exports = MockControl;
