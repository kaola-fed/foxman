const { lowerCaseFirstLetter } = require('../helper/util');
const { util } = require('../helper');

const dependencies = {};

module.exports = { register, di, dependencies, get };

function register(key, value) {
    dependencies[key] = value;
}

function di(fn, context = {}) {
    const args = matchArguments(fn);
    fn.apply(context, args.map(arg => find(arg)));
}

function find(name) {
    const injected = dependencies.hasOwnProperty(name);
    if (!injected) {
        util.error(`Plugin ${name} is not loaded!`);
    }
    return dependencies[name];
}

function get(pluginName) {
    return dependencies[lowerCaseFirstLetter(pluginName)];
}

function matchArguments(fn) {
    const args = fn.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
    return args && args[1] ? args[1].replace(/ /g, '').split(',') : [];
}
