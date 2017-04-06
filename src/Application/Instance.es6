/**
 * Created by hzxujunyu on 2016/9/19.
 */
import {util as _} from '../helper';
const pid = _.createSystemId();


function init(plugin) {
    Object.assign(plugin, {
        id: pid(),
        name: plugin.constructor.name
    }, {
        pending: (fn) => pending(fn, plugin),
        enable: (typeof plugin.enable === 'undefined' ? true : plugin.enable)
    });
}

/**
 * plugin的方法，作用是挂起application的加载plugin
 * @param fn
 * @returns {Number}
 */
function pending(fn, plugin) {
    let pending = new Promise(resolve => {
        process.nextTick(() => {
            returnPromise(fn(resolve)).catch(e => {
                console.error(e);
            });
        });
    });
    plugin.pendings = (plugin.pendings) ? [...plugin.pendings, pending] : [pending];
}

function returnPromise(result) {
    if (_.isPromise(result)) {
        return result;
    }
    return wrapPromise(result);
}

function wrapPromise(result) {
    return new Promise((resolve) => {
        resolve(result);
    });
}

export {init};