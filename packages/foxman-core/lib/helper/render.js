const Render = require('fast-ftl').default;
const { values } = require('./util');

class RenderUtil {
    constructor({ viewRoot, templatePaths = {} }) {
        this.freemarker = Render({
            root: viewRoot,
            paths: values(templatePaths) //common 权重高
        });
    }

    /**
     * @param {string} p1
     * @param {object} data
     * @returns {*|!Array}
     */
    parse(p1, data) {
        return this.freemarker.parse(p1, data);
    }
}

module.exports = RenderUtil;
