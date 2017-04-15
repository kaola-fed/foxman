/**
 * Created by hzxujunyu on 2016/9/19.
 */
const {util: _} = require('@foxman/helpers');
const pid = _.createSystemId();

module.exports = init;

function init(plugin) {
    const {enable = true} = plugin;

    Object.assign(plugin, {
        id: pid(), name: plugin.constructor.name, enable,
        pendings: [],
        pending: fn => {
            registerPendingToPlugin(generatePending(fn), plugin);
        }
    });
}

function generatePending(fn) {
    return new Promise(done => {
        // process.nextTick(() => {
        _.ensurePromise(fn(done)).catch(e => {
            console.error(e);
        });
        // });
    });
}

function registerPendingToPlugin(pending, plugin) {
    plugin.pendings = [...plugin.pendings, pending];
}
