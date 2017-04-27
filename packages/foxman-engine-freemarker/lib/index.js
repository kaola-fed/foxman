const { Render } = require('fast-ftl');

class Freemarker {
    constructor(root, engineConfig = {}) {
        const options = Object.assign({ root }, engineConfig);
        this.freemarker = Render(options);
    }

    parse(filepath, data) {
        return this.freemarker.parse(filepath, data);
    }
}

module.exports = Freemarker;
