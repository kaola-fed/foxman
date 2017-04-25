const path = require( 'path' );

class VconsolePlugin {
    name() {
        return 'vconsole';
    }

    dependencies() {
        return [ 'server' ];
    }

    service() {
        return {};
    }

    constructor() {}

    init({ service }) {
        const injectScript = service('server.injectScript');
        const serve = service('server.serve');

        serve( '__VCONSOLE_CLIENT__', path.join( __dirname, '../static/' ) );

        injectScript({
            condition: request => typeof request.query.vconsole !== 'undefined',
            src: `/__VCONSOLE_CLIENT__/vconsole.min.js`
        });
    }
}

module.exports = VconsolePlugin;
