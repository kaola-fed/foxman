const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

class AutoPrefixer {
    constructor(options) {
        this.instance = postcss(autoprefixer(options));
        this.raw;
    }
        
    toSource (raw) {
        return raw;
    }

    handler ({
        raw, filename,
        resolve, reject
    }) {
        const instance = this.instance;
        instance.process(raw, {
			// map: file.sourceMap ? {annotation: false} : false,
			// from: file.path,
			// to: file.path
		})
            .then(function({css}){
                resolve(css);
            })
            .catch(reject);
    }
}

exports = module.exports = AutoPrefixer