class ResourcesManager {
    constructor() {
        this._map = {};
    }

    set({ reqPath, processed }) {
        this._map[reqPath] = processed;
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
