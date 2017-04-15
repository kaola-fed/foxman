const path = require('path');

module.exports = function formatStaticOptions(opts = {}) {
    if (typeof opts === 'string') {
        opts = {
            dir: opts
        };
    }

    opts.dir = path.resolve(process.cwd(), opts.dir);
    
    const {
        dir,
        prefix = '/' + path.parse(opts.dir).base,
        maxAge = 0,
        gzip = true,
        preload = false,
        dynamic = true,
        buffer = true,
        filter = file => !~file.indexOf('node_modules')
    } = opts;

    return {
        dir,
        prefix,
        maxAge,
        gzip,
        preload,
        dynamic,
        buffer,
        filter
    };
};
