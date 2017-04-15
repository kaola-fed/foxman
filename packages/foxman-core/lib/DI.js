const { lowerCaseFirstLetter } = require('@foxman/helpers/lib/util');
const { util } = require('@foxman/helpers');

module.exports = function() {
    const registry = require('./registry')();

    return {
        di(fn, context = {}) {
            const names = matchArguments(fn);
            return fn.apply(context, names.map(name => lookup(registry, name)));
        },
        register(name, plugin) {
            return registry.register(lowerCaseFirstLetter(name), plugin);
        },
        dependencies: registry.$
    };
};

function lookup(registry, name) {
    const plugin = registry.lookup(lowerCaseFirstLetter(name));
    if (!plugin) {
        return util.error(`Plugin ${name} is not loaded!`);
    }
    return plugin;
}

function matchArguments(fn) {
    const args = fn.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
    return args && args[1] ? args[1].replace(/ /g, '').split(',') : [];
}
