const {Render} = require('fast-ftl');
const {values, typeOf} = require('./typer');

function parseJSON(jsonStr) {
    const result = new Function(`return ${jsonStr}`)();

    if (typeOf(result) === 'object') {
        return result;
    }

    return {};
}


class Freemarker {
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

exports.Render = Freemarker;
exports.parseJSON = parseJSON;