const { lowerCaseFirstLetter } = require('@foxman/helpers/lib/util');
const { util } = require('@foxman/helpers');

const dependencies = {};

module.exports = { register, di, dependencies, get };

function register(pluginName, plugin) {
    dependencies[lowerCaseFirstLetter(pluginName)] = plugin;
}

function di(fn, context = {}) {
    const args = matchArguments(fn);
    return fn.apply(context, args.map(pluginName => find(pluginName)));
}

function find(pluginName) {
    const plugin = get(pluginName);
    if (!plugin) {
        return util.error(`Plugin ${pluginName} is not loaded!`);
    }
    return plugin;
}

function get(pluginName) {
    return dependencies[lowerCaseFirstLetter(pluginName)];
}

function matchArguments(fn) {
    const args = fn.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
    return args && args[1] ? args[1].replace(/ /g, '').split(',') : [];
}
