const co = require('co');
const { log, entries } = require('@foxman/helpers/lib/util');
const initializePlugin = require('./initializePlugin');
const DI = require('./DI');

module.exports = class Core {
    constructor() {
        this.di = DI();
    }

    use(plugin) {
        const { register } = this.di;
        if (!plugin) {
            return false;
        }

        if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));

        initializePlugin(plugin);

        register(plugin.name, plugin);

        log(`plugin loaded: ${plugin.name}`);
    }

    start() {
        const { dependencies, di } = this.di;
        return co(function*() {
            for (const [, plugin] of entries(dependencies)) {
                if (plugin.init && plugin.enable) {
                    di(plugin.init, plugin);
                    if (plugin.pendings.length > 0) {
                        log(`plugin pedding: ${plugin.name}`);
                        yield Promise.all(plugin.pendings);
                        log(`plugin done: ${plugin.name}`);
                    }
                }
            }
        })
            .then(() => {
                for (const [, plugin] of entries(dependencies)) {
                    if (plugin.runOnSuccess) {
                        plugin.runOnSuccess();
                    }
                }
            })
            .catch(e => console.error(e));
    }

    stop() {
        const { dependencies } = this.di;
        return co(function*() {
            for (const [, plugin] of entries(dependencies)) {
                if (plugin.destroy && plugin.enable) {
                    yield plugin.destroy();
                }
            }
        }).catch(e => console.error(e));
    }

    get(...args) {
        const get = this.di.get;
        return get(...args);
    }
};
