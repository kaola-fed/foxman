const co = require('co');
const dotProp = require('dot-prop');
const {
    logger, string
} = require('@foxman/helpers');
const {log} = logger;
const {upperCaseFirstLetter,lowerCaseFirstLetter} = string; 

const initializePlugin = require('./initializePlugin');
const createRegistry = require('./createRegistry');

module.exports = class Core {
    constructor() {
        this._pluginRegistry = createRegistry();
        this._serviceRegistry = createRegistry();
    }

    use(plugin) {
        if (!plugin) {
            return;
        }

        if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));

        initializePlugin(plugin);

        this._register(plugin);

        log(`plugin loaded: ${upperCaseFirstLetter(plugin.name())}`);
    }

    _register(plugin) {
        const name = lowerCaseFirstLetter(plugin.name());
        const services = typeof plugin.service === 'function'
            ? plugin.service()
            : {};

        this._pluginRegistry.register(name, plugin);
        this._serviceRegistry.register(
            name,
            this._bindServiceContext(services, plugin)
        );
    }

    // 绑定service上下文
    _bindServiceContext(services, context) {
        const tmp = {};
        Object.keys(services).forEach(name => {
            const service = services[name];
            tmp[name] = service.bind(context);
        });
        return tmp;
    }

    _getter(keypath) {
        const [pluginName, ...rest] = keypath.split('.');
        const plugin = this._pluginRegistry.lookup(pluginName);
        if (!plugin) {
            return;
        }

        if (rest.length === 0) {
            // TODO: deepClone
            return plugin.$options;
        }

        return dotProp.get(plugin.$options || {}, rest.join('.'));
    }

    _service(keypath) {
        const [pluginName, serviceName] = keypath.split('.');

        if (!serviceName) {
            return this._serviceRegistry.lookup(pluginName);
        }

        const services = this._serviceRegistry.lookup(pluginName);

        if (!services) {
            return function() {};
        }

        return services[serviceName] || function() {};
    }

    start() {
        const plugins = this._pluginRegistry.all();

        const getter = this._getter.bind(this);
        const service = this._service.bind(this);

        return co(function*() {
            for (const i in plugins) {
                const plugin = plugins[i];

                if (plugin.init && plugin.$options.enable) {
                    plugin.init({ getter, service });

                    if (plugin.pendings.length > 0) {
                        const pluginName = upperCaseFirstLetter(plugin.name());
                        log(`plugin pending: ${pluginName}`);
                        yield Promise.all(plugin.pendings);
                        log(`plugin done: ${pluginName}`);
                    }
                }
            }
        })
            .then(() => {
                for (const i in plugins) {
                    const plugin = plugins[i];

                    if (plugin.ready) {
                        plugin.ready();
                    }
                }
            })
            .catch(e => console.error(e));
    }

    stop() {
        const plugins = this._pluginRegistry.all();

        return co(function*() {
            for (const i in plugins) {
                const plugin = plugins[i];

                if (plugin.destroy && plugin.$options.enable) {
                    yield plugin.destroy();
                }
            }
        }).catch(e => console.error(e));
    }
};
