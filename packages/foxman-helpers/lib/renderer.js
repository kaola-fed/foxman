const FastFTL = require('fast-ftl').default;
const { values } = require('./util');

class Renderer {
    constructor({ viewRoot, templatePaths = {} }) {
        this._renderer = FastFTL({
            root: viewRoot,
            paths: values(templatePaths)
        });
    }

    parse(filepath, data) {
        return this._renderer.parse(filepath, data);
    }
}

module.exports = Renderer;
