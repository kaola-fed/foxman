const path = require('path');

module.exports = function formatStaticOptions(opts = {}) {
    if (typeof opts === 'string') {
        opts = {
            dir: opts
        };
    }

    opts.dir = path.resolve(process.cwd(), opts.dir);
    
    const {
        dir, maxAge = 0, buffer = true,
        prefix = '/' + path.parse(opts.dir).base,
        filter = file => !~file.indexOf('node_modules')
    } = opts;

    return {
        dir, prefix, maxAge, buffer, filter
    };
};
