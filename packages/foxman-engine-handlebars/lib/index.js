const co = require('co');
const Renderer = require('./renderer.js');

class Handlebars {
    constructor(root, engineConfig = {}) {
        this.renderer = Renderer(Object.assign({
            root
        }, engineConfig));
    }

    parse(filepath, data) {
        return co(this.renderer.render(filepath, data));
    }
}

module.exports = Handlebars;
