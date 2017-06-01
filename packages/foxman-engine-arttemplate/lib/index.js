const template = require('art-template');

class ArtTemplate {
    constructor(base, engineConfig = {}) {
        const defaultSettings = { debug: true };
        const settings = Object.assign({root: base}, defaultSettings, engineConfig);
        
        this.renderer = template;
        this.renderer.render = (filename, data) => {
            settings.filename = filename;
            try {
                return template.compile(settings)(data);
            } catch (error) {
                delete error.stack;
                throw new Error(JSON.stringify(error, null, 4));
            }
        };
    }

    parse(view, data) {
        return Promise.resolve().then(() => this.renderer.render(view, data));
    }
}

module.exports = ArtTemplate;