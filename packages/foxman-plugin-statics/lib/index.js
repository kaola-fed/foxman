const path = require('path');

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
        this.$options.statics.forEach(({dirname, prefix, maxAge}) => serve(dirname, __dirname, maxAge));
    }
}

module.exports = StaticsPlugin;
