const Logger = require('chalklog');
const forward = require('./forward');

const log = new Logger('forward');

module.exports = class ForwardPlugin {
    constructor(options) {
        this.options = options || {};
    }

    name() {
        return 'forward';
    }

    service() {
        return {};
    }

    init({ service }) {
        const use = service('server.use');

        const { routes = [] } = this.options;

        use(
            () =>
                function*(next) {
                    const originalUrl = this.originalUrl;

                    const matched = routes.some(route => {
                        let { from, to } = route;
                        let result;
                        let regexp;
                        if (from.exec) {
                            regexp = from;
                        } else {
                            regexp = new RegExp(from);
                        }

                        /* eslint-disable */
                        if (result = regexp.exec(originalUrl)) {
                            /* eslint-enable */
                            if (to instanceof Function) {
                                to = to(...result);
                            }
                            log.green(`${originalUrl} -> ${to}`);
                            forward.call(this, to);
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (!matched) {
                        yield next;
                    }
                }
        );
    }
};
