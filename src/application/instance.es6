/**
 * Created by hzxujunyu on 2016/9/19.
 */
import {util as _} from '../helper';
const pid = _.createSystemId();

export default {

    init(plugin) {
        Object.assign(plugin, {
            id: pid(),
            name: plugin.constructor.name,
            pending: (fn) => this.pending(fn, plugin),
            enable: true
        });
    },

    /**
     * plugin的方法，作用是挂起application的加载plugin
     * @param fn
     * @returns {Number}
     */
    pending(fn, plugin) {
        let pending = new Promise(resolve => {
            this.returnPromise(fn(resolve))
        });
        plugin.pendings = (this.pendings) ? [...this.pendings, pending] : [pending];
    },

    returnPromise(result) {
        if (_.isPromise(result)) {
            return result;
        }
        return this.wrapPromise(result);
    },

    wrapPromise(result) {
        return new Promise((resolve) => {
            resolve(result);
        });
    }
};
