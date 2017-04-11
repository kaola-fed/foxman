const { lowerCaseFirstLetter } = require('@foxman/helpers/lib/util');
const { util } = require('@foxman/helpers');

const dependencies = {};

module.exports = { register, di, dependencies, get };

function register(key, value) {
    dependencies[key] = value;
}

function di(fn, context = {}) {
    const args = util.matchArgs(fn);
    fn.apply(context, inject(args));
}

function inject(args) {
    return args.map(arg => find(arg));
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
