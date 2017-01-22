import EventEmitter from 'events';
import {
    util
} from '../helper';
import instance from './instance';
import DI from './di';

const dI = new DI();
const dependency = dI.dependency;

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.middleware = [];
        this.dI = dI;
    }

    setConfig(config) {
        this.config = config;
    }

    use(plugin) {
        if (!plugin) return false;
        if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));

        instance.init(plugin);
        dI.register(util.initialsLower(plugin.name), plugin);

        util.log(`plugin loaded: ${plugin.name}`);
    }

    execute() {
        return async function () {
            const keys = Object.keys(dependency);
            const plugins = keys.map(key => dependency[key]);

            await Promise.all(plugins.map(async plugin => {
                if (!plugin.init
                    || !plugin.enable) return 0;

                dI.resolve(plugin.init, plugin);

                if (plugin.pendings) {
                    util.log(`${plugin.name} needs pending`);
                    await Promise.all(plugin.pendings);
                    util.log(`${plugin.name}'s pending is end`);
                }

            }));
        };
    }

    async run() {
        const pipeline = this.execute();
        try {
            await pipeline();
        } catch (e) {
            console.log(e);
        }
        Application.runSuccess();
    }

    static runSuccess() {
        dependency.serverPlugin.start();
    }
}
