const path = require('path');
const Reloader = require('../lib/reloader');

test('Reloader', () => {
    const reloader = new Reloader({
        livereload: (url) => {
            expect(url).toBe('1');
        },
        createWatcher: () => {
            return {
                on: (type, fn) => {
                    fn('1');
                }
            };
        }
    });

    reloader.watch();

    reloader.notifyReload('1');
});
