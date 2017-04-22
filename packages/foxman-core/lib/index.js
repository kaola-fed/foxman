const co = require('co');
const dotProp = require('dot-prop');
const ora = require('ora');
const { logger, string } = require('@foxman/helpers');
const { lowerCaseFirstLetter } = string;

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

    _service(keypath = '') {
        const [pluginName, serviceName] = keypath.split('.');
        const pluginService = this._serviceRegistry.lookup(pluginName);
        if (!serviceName) {
            if (pluginService) {
                return pluginService;
            }
            logger.warn(`plugin ${pluginName} is not found!`);
            return {};
        }

        const services = this._serviceRegistry.lookup(pluginName);

        if (!services) {
            return function() {};
        }

        if (serviceName in services) {
            return services[serviceName];
        }

        logger.warn(`service ${keypath} is not found!`);
        return function() {};
    }

    _call(keypath = '', ...args) {
        const [pluginName, methodName] = keypath.split('.');

        if (!methodName) {
            return;
        }

        if (pluginName === '*') {
            const plugins = this._pluginRegistry.all();
            return Object.keys(plugins).map(pluginName =>
                this._call(`${pluginName}.${methodName}`)
            );
        }

        const plugin = this._pluginRegistry.lookup(pluginName);

        return this._doCall(plugin, methodName, args);
    }

    _doCall(plugin, methodName, args) {
        if (!plugin) {
            return;
        }

        if (typeof plugin.public()[methodName] === 'function') {
            return plugin.public()[methodName].apply(plugin, args);
        }
    }

    _names() {
        const plugins = this._pluginRegistry.all();
        return Object.keys(plugins);
    }

    start() {
        const plugins = this._pluginRegistry.all();

        const getter = this._getter.bind(this);
        const service = this._service.bind(this);
        const call = this._call.bind(this);
        const names = this._names.bind(this);

        const spinner = ora();

        return co(function*() {
            spinner.start();

            const pluginNum = Object.keys(plugins).length;

            let counter = 0;
            for (const i in plugins) {
                const plugin = plugins[i];
                const pluginName = lowerCaseFirstLetter(plugin.name());

                counter++;
                spinner.text = `[${counter}/${pluginNum}] Loading ${pluginName}`;

                try {
                    if (plugin.init && plugin.$options.enable) {
                        plugin.init({ getter, service, call, names });

                        if (plugin.pendings.length > 0) {
                            yield Promise.all(plugin.pendings);
                        }
                    }

                    spinner.succeed(`Plugin ${pluginName} loaded`);
                } catch (e) {
                    spinner.fail(`Failed to load plugin ${pluginName}`);
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
