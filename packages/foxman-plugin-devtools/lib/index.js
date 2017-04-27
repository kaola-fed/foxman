const api = require('./api');

module.exports = class DevtoolsPlugin {
    constructor( options ) {
        this.options = options;
    }

    name() {
        return 'devtools';
    }

    init({ service }) {
        const use = service( 'server.use' );
        use( api );
    }
};
