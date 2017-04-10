const co = require( 'co' );
const { lowerCaseFirstLetter, log, entries } = require( '../helper/util' );
const { init } = require( './Instance' );
const { register, di, dependencies, get } = require( './DI' );

module.exports = { use, run, get };

function use(plugin) {
    if (!plugin) {
        return false;
    }

    if (Array.isArray(plugin)) return plugin.forEach(use);

    init(plugin);

    register(lowerCaseFirstLetter(plugin.name), plugin);

    log(`plugin loaded: ${plugin.name}`);
}

function run() {
    co(execute(dependencies))
        .then(runPlugins(dependencies))
        .catch(e => console.error(e));
}

function* execute(dependencies) {
    for (const [, plugin] of entries(dependencies)) {
        if (plugin.init && plugin.enable) {
            di(plugin.init, plugin);

            if (plugin.pendings) {
                yield Promise.all(plugin.pendings);
            }
        }
    }
}

function runPlugins(dependencies) {
    return function () {
        for (const [, plugin] of entries(dependencies)) {
            if (plugin.runOnSuccess) {
                plugin.runOnSuccess();
            }
        }
    };
}
