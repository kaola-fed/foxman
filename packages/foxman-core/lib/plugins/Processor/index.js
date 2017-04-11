const {dispatcher} = require('./Processor');
const ReloaderService = require('./ReloaderService');

class ProcessorPlugin {
    constructor({processors}) {
        this.processors = processors;
        if (undefined === processors) {
            this.enable = false;
        }
    }

    init(serverPlugin, watcherPlugin, reloaderPlugin) {
        const {processors} = this;
        const {server} = serverPlugin;
        const {watcher} = watcherPlugin;
        const {reloader} = reloaderPlugin;

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
