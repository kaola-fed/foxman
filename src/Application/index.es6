import co from 'co';
import {lowerCaseFirstLetter, log, notify, entries, error, isPromise, isGeneratorDone} from '../helper/util';
import {init} from './Instance';
import {register, resolve, dependencies, get} from './DI';

export { use, run, get };

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
    for (let [, plugin] of entries(dependencies)) {
        if (plugin.init && plugin.enable) {
            resolve(plugin.init, plugin);

            if (plugin.pendings) {
                notify({
                    title: 'Plugin start pending',
                    msg: `${plugin.name} start pending`
                });

                yield Promise.all(plugin.pendings);

                notify({
                    title: 'Plugin end pending',
                    msg: `${plugin.name} end pending`
                });
            }
        }
    }
}

function runPlugins(dependencies) {
    return function () {
        for (let [, plugin] of entries(dependencies)) {
            if (plugin.runOnSuccess) {
                plugin.runOnSuccess();
            }
        }
    };
}
