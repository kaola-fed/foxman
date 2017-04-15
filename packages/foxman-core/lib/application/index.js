const co = require( 'co' );
const { log, entries } = require( '@foxman/helpers/lib/util' );
const { init } = require( './Instance' );
const { register, di, dependencies, get } = require( './DI' );

module.exports = { use, run, get };

function use(plugin) {
    if (!plugin) {
        return false;
    }

    if (Array.isArray(plugin)) return plugin.forEach(use);

    init(plugin);

    register(plugin.name, plugin);

    log(`plugin loaded: ${plugin.name}`);
}

function run() {
    return co(execute(dependencies))
        .then(runPlugins(dependencies))
        .catch(e => console.error(e));
}

function* execute(dependencies) {
    for (const [, plugin] of entries(dependencies)) {
        if (plugin.init && plugin.enable) {
            di(plugin.init, plugin);
            if (plugin.pendings.length > 0 ) {
                log(`plugin pedding: ${plugin.name}`);
                yield Promise.all(plugin.pendings);
                log(`plugin done: ${plugin.name}`);
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
