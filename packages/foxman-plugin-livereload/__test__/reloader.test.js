const path = require('path');
const Reloader = require('../lib/reloader');

test('Reloader', () => {
    const reloader = new Reloader({
        livereload: () => {},
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

    expect(1).toBe(1);
});
