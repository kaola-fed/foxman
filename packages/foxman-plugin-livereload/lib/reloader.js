const path = require('path');

class Reloader {
    constructor({livereload, createWatcher}) {
        this._livereload = livereload;
        this._createWatcher = createWatcher;
    }

    notifyReload(url) {
        return this._livereload({
            type: 'livereload',
            payload: url
        });
    }

    watch(files) {
        this._createWatcher({files}).on('change', filepath =>
            this.notifyReload(path.basename(filepath)));
    }
}

module.exports = Reloader;
