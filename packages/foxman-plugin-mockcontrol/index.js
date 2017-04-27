const JSON5 = require('json5');
const fs = require('fs');
let { logger, path } = require('@foxman/helpers');

logger = logger.createLogger('mock-control');
function MockControl(options) {
    this.mapJS =
        options.mapJS ||
        function(dataPath) {
            return dataPath.replace(/\.json$/, '.js');
        };
}

MockControl.prototype.init = function({ getter, service }) {
    if (getter('proxy.enable')) {
        return;
    }

    const self = this;
    service('server.use')(
        function() {
            return function*(next) {
                const dispatcher = this.dispatcher;
                if (!dispatcher || dispatcher.type === 'dir') {
                    return yield next;
                }

                const request = this.request;
                let dataPath = dispatcher.dataPath;
                let data;
                let jsonFound = true;

                dataPath = ensureItem(dataPath);

                if (dataPath.length === 0) {
                    return yield next;
                }

                try {
                    delete require.cache[dataPath];
                    data = JSON5.parse(fs.readFileSync(dataPath));
                } catch (err) {
                    jsonFound = false;
                    data = {};
                }
                try {
                    const scriptPath = self.mapJS(dataPath);
                    delete require.cache[scriptPath];
                    const handler = require(scriptPath);
                    dispatcher.handler = () => {
                        return new Promise(resolve => {
                            resolve(handler(data, request) || data);
                        });
                    };

                    if (!jsonFound) {
                        logger.error(
                            `File ${path.shorten(dataPath)} parsed failed. So output empty object({})`
                        );
                    }
                } catch (err) {
                    if (err.code !== 'MODULE_NOT_FOUND') {
                        logger.error(err);
                    }
                }

                yield next;
            };
        }.bind(this)
    );
};

function ensureItem(item) {
    if (!item) {
        return [];
    }

    return Array.isArray(item) ? item[item.length - 1] : item;
}

module.exports = MockControl;
