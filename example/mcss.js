const mcss = require('mcss');

class Mcss {
    constructor({
        pathes = [],
        format = 1,
        sourcemap = false,
        indent = '    '
    }) {
        this.instance = mcss({
            pathes, format, sourcemap, indent
        });
        this.raw;
    }
        
    // this.raw = raw;
    toSource (raw) {
        return raw.replace(/\.css$/g, '\.mcss');
    }

    handler ({
        raw, filename,
        resolve, reject
    }) {
        console.log('filename', filename)
        const instance = this.instance;
        instance.set('filename', filename);
        instance.translate(raw)
            .done(resolve)
            .failed(reject);
    }
}

exports = module.exports = Mcss