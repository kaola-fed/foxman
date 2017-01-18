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
		this.uid = util.createSystemId();
		this.middleware = [];
		this.dI = dI;
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
			pending: (...args) => instance.pending.apply(plugin, args),
		});

    const pluginName = plugin.name || plugin.id;
    
		dI.register(util.initialsLower(pluginName), plugin);
		util.log(`plugin loaded: ${pluginName}`);
	}

	execute() {
		return function* () {
			const keys = Object.keys(dependency);
			const plugins = keys.map((key) => dependency[key]);
			for (let plugin of plugins) {
				plugin.init && dI.resolve(plugin.init, plugin);
				if (plugin.pendings) {
					util.log(`${plugin.name} needs pending`);
					yield Promise.all(plugin.pendings);
					util.log(`${plugin.name}'s pending is end`);
				}
			}
		};
	}

	run() {

		const runSuccess = this.runSuccess;
		const pipeline = this.execute().call(this);
		let final = {};
		const loop = () => {
			final = pipeline.next();
			if (!final.done) {
				if (!final.value.then) {
					return loop();
				}
				final.value.then( () => loop())
                    .catch((err) => {
                        console.log(err);
                    });
			} else {
				runSuccess();
			}
		};
		loop();

	}

	runSuccess() {
		dependency.serverPlugin.start();
	}
}
