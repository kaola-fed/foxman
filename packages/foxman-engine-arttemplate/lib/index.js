const template = require('art-template');

class ArtTemplate {
    constructor(base, engineConfig = {}) {
        const {extname = '.html'} = engineConfig;
        template.config('base', base);
        template.config('extname', extname);

        this.renderer = template;
    }

    parse(filepath, data) {
        return this.renderer(filepath, data);
    }
}

module.exports = ArtTemplate;
