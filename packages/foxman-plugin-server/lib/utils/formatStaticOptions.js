const path = require('path');

module.exports = function formatStaticOptions(opts = {}) {
    let options = opts;
    if (typeof options === 'string') {
        options = {
            dir: path.resolve(process.cwd(), options)
        };
    }

    const {
        dir, maxAge = 0, buffer = true,
        prefix = '/' + path.parse(options.dir).base,
        filter = file => !~file.indexOf('node_modules')
    } = options;

    return {
        dir, prefix, maxAge, buffer, filter
    };
};
