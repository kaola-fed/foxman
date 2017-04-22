const Watcher = require('../lib');
const watcher = new Watcher();
const path = require('path');
const { fs } = require('@foxman/helpers');
const filepath = path.join(__dirname, 'fixtures', 'foo.txt');

test('createWatcher', done => {
    const _watcher = watcher._createWatcher({
        files: filepath
    });
    writeFooBar(1);
    return new Promise(resolve => {
        _watcher.on('change', file => {
            _watcher.close();
            resolve();
            expect(file).toBe(filepath);
            done();
        });
    });
});

test('createWatcher2', done => {
    const _watcher = watcher._createWatcher(filepath);
    writeFooBar(2);
    return new Promise(resolve => {
        _watcher.on('change', file => {
            _watcher.close();
            resolve();
            expect(file).toBe(filepath);
            done();
        });
    });
});

test('createWatcher3', done => {
    const _watcher = watcher._createWatcher([filepath]);
    writeFooBar(3);
    return new Promise(resolve => {
        _watcher.on('change', file => {
            _watcher.close();
            resolve();
            expect(file).toBe(filepath);
            done();
        });
    });
});

function writeFooBar(taskId) {
    setTimeout( () => {
        fs.write(filepath, 'Foo Bar' + taskId);
    }, 1000);
}