const path = require('path');
const Reloader = require('../lib/Reloader');


test('Reloader', () => {
    const reloader = new Reloader({ 
        livereload: () => {
            
        },
        createWatcher:() => {
            return {
                on: () => {

                }
            }
        }
    });
    
    reloader.watch();

    reloader.notifyReload();

    expect(1).toBe(1);
})