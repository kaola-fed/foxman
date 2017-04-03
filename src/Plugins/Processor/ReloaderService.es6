class ReloaderService{
    constructor({
        watcher, reloader
    }) {
        this.map = {};
        this.watcher = watcher;
        this.reloader = reloader;
    }

    register({
        reqPath, dependencies
    }) {
        const oldThings = this.map[reqPath] || [];

        let diff = findNew({
            oldThings: oldThings, 
            newThings: dependencies
        });

        if (diff.length === 0) {
            return;
        }

        this.watcher.onUpdate(diff, () => {
            this.reloader.reload(reqPath);
        })
        this.map[reqPath] = [...oldThings, ...diff];
    }
}

function deDuplication(list = []) {
    return Object.keys(list.reduce(function (prev, item) {
        prev[item] = null;
        return prev;
    }, {}));
}

function findNew({
    oldThings = [], newThings = []
}) {
    const oldThingMap = oldThings.reduce(function (prev, item) {
        prev[item] = null;
        return prev;
    }, {});

    return newThings.filter(item => {
        return oldThingMap[item] === undefined;
    });
}

let instance;
export default function (options) {
    if (!instance) {
        instance = new ReloaderService(options);
    }
    return instance;
}