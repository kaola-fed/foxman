const { dispatcher } = require('./Processor');
const ReloaderService = require('./ReloaderService');
const ResourcesManager = require('./ResourcesManager');

class ProcessorPlugin {
    name() {
        return 'processor';
    }

    dependencies() {
        return ['server', 'watcher', 'livereload'];
    }

    service() {
        return {};
    }

    constructor({ processors }) {
        this.processors = processors;
        if (undefined === processors) {
            this.$options = { enable: false };
        }
    }

    init({ service }) {
        const use = service('server.use');
        const createWatcher = service('watcher.create');
        const reload = service('livereload.reload');
        const processors = this.processors || [];

        processors.forEach(processor => {
            const resourcesManager = new ResourcesManager();
            use(
                dispatcher({
                    processor,
                    resourcesManager,
                    reloaderService: new ReloaderService({
                        createWatcher,
                        resourcesManager,
                        reload
                    })
                })
            );
        });
    }
}

module.exports = ProcessorPlugin;
