import {
    util
} from '../helper';
class DI {
	constructor() {
		this.dependency = {};
	}
    /**
    * 服务注册
    * @param key
    * @param value
    */
	register(key, value) {
		this.dependency[key] = value;
	}
  /**
   * 依赖注入
   * @param func
   * @param scope
   */
	resolve(func, scope = {}) {
		const args = util.matchArgs(func);
		func.apply(scope, this.inject(args));
	}

  inject(args) {
    return args.map(arg => this.find(arg));
  }

  find(arg) {
    if (!this.hasInjected(arg)) {
      util.error(`Plugin ${arg} is not loaded!`);
    }
    return this.dependency[arg];
  }

  hasInjected(dependency) {
    return this.dependency.hasOwnProperty(dependency);
  }

}
export default DI;
