const path = require( 'path' );

module.exports = function formatStaticOptions(opts = {}) {
    let options = opts;
    if (typeof options === 'string') {
        options = {
            dir:
            path.resolve(process.cwd(), options)
        };
    }

    const {
        dir,
        prefix = ('/' + path.parse(options.dir).base),
        maxAge = 0,
        gzip = true,
        preload = false,
        dynamic = true,
        filter = file => file.indexOf('node_modules') === -1
    } = options;

    return {
        dir, prefix, maxAge,
        gzip, preload,
        dynamic,
        filter
    };
};
