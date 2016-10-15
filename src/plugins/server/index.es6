import Server from './server';

class ServerPlugin {
    constructor(options) {
        this.options = options;
    }
    init() {
        this.server = new Server(this.options);
    }
    start() {
        this.server.createServer();
    }
}
export default ServerPlugin;
