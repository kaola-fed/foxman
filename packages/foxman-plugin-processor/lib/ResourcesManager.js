class ResourcesManager {
    constructor() {
        this._map = {};
    }

    set(reqPath, {version, content}) {
        this._map[reqPath] = {version, content};
    }

    has(reqPath) {
        return !!this._map[reqPath];
    }

    get(reqPath) {
        return this._map[reqPath];
    }

    clear(reqPath) {
        this._map[reqPath] = null;
    }
}

module.exports = ResourcesManager;
