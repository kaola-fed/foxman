const { lowerCaseFirstLetter } = require( '../helper/util' );
const { util } = require( '../helper' );

const dependencies = {};

module.exports = { register, resolve, dependencies, get };

function register(key, value) {
    dependencies[key] = value;
}

function resolve(func, scope = {}) {
    const args = util.matchArgs(func);
    func.apply(scope, inject(args));
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
