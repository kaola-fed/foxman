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
            this.$options.enable = false;
        }
    }

    init({ service }) {
        const use = service('server.use');
        const watch = service('watch.watch');
        const reload = service('livereload.reload');

        use(
            dispatcher({
                processors: this.processors,
                reloaderService: ReloaderService({ watch, reload })
            })
        );
    }
}

module.exports = ProcessorPlugin;
