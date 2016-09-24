import EventEmitter from 'events'
import {
    util
} from '../helper'
import instance from './instance'
import cluster from 'cluster';

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.uid = util.createSystemId();
        /**
         * 依赖管理
         * @type {{}}
         */
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

    setConfig(config) {
        this.config = config;
    }

    use(plugin) {
        if (!plugin) return false;
        if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));

        Object.assign(plugin, {
            config: this.config,
            id: this.uid(),
            name: plugin.constructor.name,
            pending: (...args) => instance.pending.apply(plugin, args)
        });

        this.register(util.initialsLower(plugin.name), plugin);
        util.debugLog(`plugin ${plugin.name || plugin.id} is loaded`);
    }

    execute() {
        return function* () {
            const keys = Object.keys(this.dependency);
            const plugins = keys.map((key) => this.dependency[key]);
            for (let plugin of plugins) {
                plugin.init && this.resolve(plugin.init, plugin);
                if (plugin.pendings) {
                    util.log(`${plugin.name} needs pending`);
                    yield Promise.all(plugin.pendings);
                    util.log(`${plugin.name}'s pending is end`);
                }
            }
        }
    }

    run() {
        let pipeline = this.execute().call(this);
        let final = {};
        +function loop() {
            final = pipeline.next();
            if (!final.done) {
                if (!final.value.then) {
                    return loop();
                }
                final.value.then(result => loop())
                    .catch((err) => { 
                        util.error(err) 
                    });
            }
        } ();
    }
}