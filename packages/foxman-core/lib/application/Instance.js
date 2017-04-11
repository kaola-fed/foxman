/**
 * Created by hzxujunyu on 2016/9/19.
 */
const { util: _ } = require('../helper');
const pid = _.createSystemId();

module.exports = { init };

function init(plugin) {
    Object.assign(
        plugin,
        {
            id: pid(),
            name: plugin.constructor.name
        },
        {
            pending: fn => pending(fn, plugin),
            enable: typeof plugin.enable === 'undefined' ? true : plugin.enable
        }
    );
}

function pending(fn, plugin) {
    const pending = new Promise(resolve => {
        process.nextTick(() => {
            returnPromise(fn(resolve)).catch(e => {
                console.error(e);
            });
        });
    });
    plugin.pendings = plugin.pendings
        ? [...plugin.pendings, pending]
        : [pending];
}

function returnPromise(result) {
    if (_.isPromise(result)) {
        return result;
    }
    return Promise.resolve(result);
}
