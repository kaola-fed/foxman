const pathToRegexp = require('path-to-regexp');

class PublicMockPlugin {
    name() {
        return 'publicMock';
    }

    dependencies() {
        return ['server'];
    }

    service() {
        return {};
    }

    constructor({ publicMockList = [] }) {
        this.publicMockList = publicMockList;
    }

    init({ service }) {
        const use = service('server.use');
        const {publicMockList} = this;

        use(() => function *(next) {
            const reqPath = this.request.path;
            const dispatcher = this.dispatcher;
            
            if (!dispatcher) {
                return yield next;
            }

            dispatcher.extendData = publicMockList.reduce((extendData, {
                pattern, data, type
            }) => {
                if (isPathMatched({pattern, reqPath}) 
                    && ( typeof type === 'undefined' 
                    || type === dispatcher.type ) ) {
                    return Object.assign(extendData, data);
                }
                return extendData;
            }, dispatcher.extendData || {});

            yield next;
        });
    }
}

function isPathMatched({ pattern, reqPath }) {
    return pathToRegexp(pattern).test(reqPath);
}

module.exports = PublicMockPlugin;
