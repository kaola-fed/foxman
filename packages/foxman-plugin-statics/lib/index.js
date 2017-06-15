class StaticsPlugin {
    name() {
        return 'statics';
    }

    dependencies() {
        return ['server'];
    }

    service() {
        return {};
    }

    constructor({ statics }) {
        this.$options = {
            statics
        };
    }

    init({ service }) {
        const serve = service('server.serve');
        serve(this.$options.statics);
    }
}

module.exports = StaticsPlugin;
