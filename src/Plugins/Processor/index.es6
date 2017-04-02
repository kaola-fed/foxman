import {dispatcher} from './Processor';

class ProcessorPlugin {
    constructor({processors}) {
        this.processors = processors;
        if ( undefined === processors) {
            this.enable = false;
        }
    }

    init(serverPlugin) {
        const {processors} = this;
        const {server} = serverPlugin;
        server.use(dispatcher({processors}));
    }
}

export default ProcessorPlugin;