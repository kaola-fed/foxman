class DI{
    constructor () {
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
    resolve(func, scope) {
        const argList = func.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
        const args = (argList && argList[1]) ? (argList[1].replace(/ /g, '').split(',')) : [];

        let deps = args.map((arg) => {
            if (!this.dependency[arg]) {
                util.error(`Plugin ${arg} is not load!`);
            }
            return this.dependency[arg];
        });

        func.apply(scope || {}, deps);
    }
}
export default DI;