const Handlebars = require('@foxman/engine-handlebars');

class Engine extends Handlebars {
    constructor(...args) {
        super(...args);
        /**
         * 做一些特定模板的扩展
         */
        this.extends(this.renderer);
    }
    extends(renderer) {
        renderer.helper('stringify', (data) => {
            return JSON.stringify(data);
        });
    }
}

module.exports = Engine;