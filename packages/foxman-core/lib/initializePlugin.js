/**
 * Created by hzxujunyu on 2016/9/19.
 */
const { system, typer } = require('@foxman/helpers');
const pid = system.createSystemId();

module.exports = init;

function init(plugin) {
    const originalPluginName = plugin.name;

    if (!plugin.$options) {
        plugin.$options = {};
    }

    if (!plugin.public) {
        plugin.public = function() {
            return {};
        };
    }

    if (typeof plugin.$options.enable === 'undefined') {
        plugin.$options.enable = true;
    }

    Object.assign(plugin, {
        id: pid(),
        name: function() {
            return typeof originalPluginName === 'function'
                ? originalPluginName()
                : plugin.constructor.name;
        },
        $options: plugin.$options,
        pendings: [],
        pending: fn => {
            registerPendingToPlugin(generatePending(fn), plugin);
        }
    });
}

function generatePending(fn) {
    return new Promise(done => {
        typer.ensurePromise(fn(done)).catch(e => {
            console.error(e);
        });
    });
}

function registerPendingToPlugin(pending, plugin) {
    plugin.pendings = [...plugin.pendings, pending];
}
