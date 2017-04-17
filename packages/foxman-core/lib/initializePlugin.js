/**
 * Created by hzxujunyu on 2016/9/19.
 */
const { util: _ } = require('@foxman/helpers');
const pid = _.createSystemId();

module.exports = init;

function init(plugin) {
    const originalPluginName = plugin.name;

    if (!plugin.$options) {
        plugin.$options = {};
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
        _.ensurePromise(fn(done)).catch(e => {
            console.error(e);
        });
    });
}

function registerPendingToPlugin(pending, plugin) {
    plugin.pendings = [...plugin.pendings, pending];
}
