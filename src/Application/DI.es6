import {lowerCaseFirstLetter} from '../helper/util';
import { util } from '../helper';

const dependencies = {};

export { register, resolve, dependencies, get };

/**
 * 服务注册
 * @param key
 * @param value
 */

function register(key, value) {
    dependencies[key] = value;
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

function find(name) {
    const injected = dependencies.hasOwnProperty(name);
    if (!injected) {
        util.error(`Plugin ${name} is not loaded!`);
    }
    return dependencies[name];
}

function get(pluginName) {
    return dependencies[lowerCaseFirstLetter(pluginName)];
}
