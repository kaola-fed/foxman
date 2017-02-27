import {
    util
} from '../helper';

const dependencys = {};

/**
 * 服务注册
 * @param key
 * @param value
 */

function register(key, value) {
    dependencys[key] = value;
}

/**
 * 依赖注入
 * @param func
 * @param scope
 */
function resolve(func, scope = {}) {
    const args = util.matchArgs(func);
    func.apply(scope, inject(args));
}

function inject(args) {
    return args.map(arg => find(arg));
}

function find(arg) {
    if (!hasInjected(arg)) {
        util.error(`Plugin ${arg} is not loaded!`);
    }
    return dependencys[arg];
}

function hasInjected(dependency) {
    return dependencys.hasOwnProperty(dependency);
}

export {
    register,
    resolve,
    dependencys
};
