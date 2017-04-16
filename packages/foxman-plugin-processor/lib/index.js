const { dispatcher } = require('./Processor');
const ReloaderService = require('./ReloaderService');

class ProcessorPlugin {
    name() {
        return 'processor';
    }

    service() {
        return {};
    }

    constructor({ processors }) {
        this.processors = processors;
        if (undefined === processors) {
            this.enable = false;
        }
    }

    init(serverPlugin, watcherPlugin, livereloadPlugin) {
        const processors = this.processors;
        const server = serverPlugin.server;
        const watcher = watcherPlugin.watcher;
        const reloader = livereloadPlugin.reloader;

        const reloaderService = ReloaderService({
            watcher,
            reloader
        });

        server.use(
            dispatcher({
                processors,
                reloaderService
            })
        );
    }
}

module.exports = ProcessorPlugin;
