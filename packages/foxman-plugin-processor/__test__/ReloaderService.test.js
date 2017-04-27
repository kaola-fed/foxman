const ReloaderService = require('../lib/ReloaderService')
const path = require('path');
const co = require('co');

const p = '/1.mcss';
const reqPath = '/1.mcss';
let handle;
const createWatcher = () => {
    return {
        on: (type, fn) => {
            handle = fn;
        },
        add: () => {

        }
    }
}

const reload = (path) => {
    expect(path).toBe(p);
}

const resourcesManager = {
    clear: (reqPath) => {
        expect(reqPath).toBe(reqPath);
    }
}

test('register', () => {
    const reloaderService = new ReloaderService({
        createWatcher, reload, resourcesManager
    });
    
    const watcher = reloaderService.register({
        reqPath: reqPath, 
        files: [p]
    });
    
    handle(p);
    expect(reqPath in reloaderService.watcherMap).toBe(true)
});


