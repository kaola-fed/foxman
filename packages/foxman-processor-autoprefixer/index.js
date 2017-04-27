const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

class AutoPrefixer {
    constructor(options) {
        this.instance = postcss(autoprefixer(options));
        this.raw;
    }
        
    locate (raw) {
        return raw;
    }
    /* eslint-disable */

    *handler ({
        raw, filename
    }) {
        const instance = this.instance;
        const {css} = yield instance.process(raw, {});
        return css;
    }
    /* eslint-enable */
}

exports = module.exports = AutoPrefixer;