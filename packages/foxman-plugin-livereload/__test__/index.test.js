const path = require('path');
const LiveReloader = require('../lib');
const liveReloader = new LiveReloader({
    extension: 'ftl',
    viewRoot: __dirname,
    templatePaths: [],
    syncData: __dirname,
    statics: []
})

test('init', () => {
    liveReloader.init({
        service: (key) => {
            return {
                'server.injectScript': () => {
                    expect(1).toBe(1);
                },
                'server.livereload': () => {
                    expect(1).toBe(1);
                },
                'watcher.create': () => {
                    return {
                        on: (type, fn) => {
                            fn('1')
                        },
                        watch: (files) => {
                            expect(files).toBe()
                        }
                    }
                }
            }[key];
        }
    })
});

test('name', () => {
    expect(liveReloader.name()).toBe('livereload')
});

test('service', () => {
    liveReloader.service().reload(1);
    expect(1).toBe(1);
});