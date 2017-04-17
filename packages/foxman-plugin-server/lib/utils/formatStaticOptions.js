const path = require('path');

module.exports = function formatStaticOptions(opts = {}) {
    let options = opts;
    if (typeof options === 'string') {
        options = {
            dir: path.resolve(process.cwd(), options)
        };
    }

    const {
        dir,
        prefix = '/' + path.parse(options.dir).base,
        maxAge = 0,
        buffer = true,
        filter = file => !~file.indexOf('node_modules')
    } = options;

    return {
        dir,
        prefix,
        maxAge,
        buffer,
        filter
    };
};
