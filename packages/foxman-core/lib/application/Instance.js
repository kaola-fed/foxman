/**
 * Created by hzxujunyu on 2016/9/19.
 */
const {util: _} = require('@foxman/helpers');
const pid = _.createSystemId();

module.exports = {init};

function init(plugin) {
    Object.assign(plugin, {
        id: pid(),
        name: plugin.constructor.name,
        pending: fn => {
            registerPendingToPlugin(generatePending(fn), plugin);
        },
        enable: typeof plugin.enable === 'undefined' ? true : plugin.enable
    });
}

function generatePending(fn) {
    return new Promise(resolve => {
        process.nextTick(() => {
            ensurePromise(fn(resolve)).catch(e => {
                console.error(e);
            });
        });
    });
}

function registerPendingToPlugin(pending, plugin) {
    if (!plugin.pendings) {
        plugin.pendings = [];
    }

    plugin.pendings = [...plugin.pendings, pending];
}

function ensurePromise(result) {
    if (_.isPromise(result)) {
        return result;
    }
    return Promise.resolve(result);
}
