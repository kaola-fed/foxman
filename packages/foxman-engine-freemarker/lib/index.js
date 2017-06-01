const { Render } = require('fast-ftl');

class Freemarker {
    constructor(root, engineConfig = {}) {
        const options = Object.assign({ root }, engineConfig);
        this.renderer = Render(options);
    }

    parse(filepath, data) {
        return this.renderer.parse(filepath, data);
    }
}

module.exports = Freemarker;
