class VconsolePlugin {
    name() {
        return 'vconsole';
    }

    service() {
        return {};
    }

    constructor() {}

    init({ service }) {
        const injectScript = service('service.injectScript');

        injectScript({
            condition: request => request.query.debug == 1,
            src: `/__FOXMAN__CLIENT__/js/vconsole.min.js`
        });
    }
}

module.exports = VconsolePlugin;
