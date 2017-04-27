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

        let watcher;
        if (!watcherMap[reqPath]) {
            watcher = this.$createWatcher(files);

            watcherMap[reqPath] = watcher;
            watcher.on('change', () => {
                resourcesManager.clear(reqPath);
                reload(reqPath);
            });

            return watcher;
        }

        watcher = watcherMap[reqPath];
        watcher.add(files);
        return watcher;
    }
}

module.exports = ReloaderService;
