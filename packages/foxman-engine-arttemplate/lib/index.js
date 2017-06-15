const template = require('art-template');

class ArtTemplate {
    constructor(base, engineConfig = {}) {
        const defaultSettings = { debug: true };
        const settings = Object.assign({root: base}, defaultSettings, engineConfig);
        
        this.renderer = template;
        this.renderer.render = (filename, data) => 
            template.compile(Object.assign(settings, {filename}))(data);
    }

    parse(view, data) {
        return Promise.resolve().then(() => this.renderer.render(view, data));
    }
}

module.exports = ArtTemplate;