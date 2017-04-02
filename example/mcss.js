const mcss = require('mcss');

class Mcss {
    constructor() {

    }

    toSource (raw) {
        return raw.replace(/mcss$/g, 'css');
    }

    handler (raw, resolve) {
        var instance = mcss({
            // filename: '/absolute/path/to/xx.file'
        });

        instance.translate(raw).done(resolve);
    }
}

exports = module.exports = Mcss