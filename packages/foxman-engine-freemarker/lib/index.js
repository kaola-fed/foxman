const { Render } = require('fast-ftl');

class Freemarker {
    constructor(viewRoot, engineConfig = {}) {
        this.viewRoot = viewRoot;
        this.engineConfig = engineConfig;
        const options = Object.assign({root: viewRoot}, engineConfig);
        this.freemarker = Render(options);
    }

    parse(p1, data) {
        return this.freemarker.parse(p1, data);
    }
}

module.exports = Freemarker;
