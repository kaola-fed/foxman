class ResourcesManager {
    constructor() {
        this.map = {};
    }

    set({
        reqPath,
        processed
    }) {
        this.map[reqPath] = processed;
    }

    has(reqPath) {
        return !!this.map[reqPath];
    }

    get(reqPath) {
        return this.map[reqPath];
    }

    clear(reqPath) {
        this.map[reqPath] = null;
    }
}

module.exports = ResourcesManager;
