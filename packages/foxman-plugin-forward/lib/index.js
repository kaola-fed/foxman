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
                        const { from, to } = route;

                        let regexp;
                        if (from.test) {
                            regexp = from;
                        } else {
                            regexp = new RegExp(from);
                        }

                        if (regexp.test(originalUrl)) {
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
