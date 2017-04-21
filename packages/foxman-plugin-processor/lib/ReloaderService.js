class ReloaderService {
    constructor({ createWatcher, reload, resourcesManager }) {
        this.watcherMap = {};

        this.$createWatcher = createWatcher;
        this.$resourcesManager = resourcesManager;
        this.$reload = reload;
    }
    register({ reqPath, files }) {
        const resourcesManager = this.$resourcesManager;
        const watcherMap = this.watcherMap;
        const reload = this.$reload;
        if (!watcherMap[reqPath]) {
            const watcher = this.$createWatcher(files);

            watcherMap[reqPath] = watcher;
            watcher.on('change', (path) => {
                resourcesManager.clear(reqPath);
                reload(path);
            });

            return;
        }
        watcherMap[reqPath].add(files);
    }
}

module.exports = ReloaderService;
