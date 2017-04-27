const path = require('path');
const originalFS = require('fs');
const del = require('del');
const { fs: _ } = require('../lib');

test('write', function(done) {
    const filepath = path.resolve(__dirname, 'fixtures/write/1/test.txt');
    _.write(filepath, 'Foo Bar').then(
        function() {
            const content = originalFS.readFileSync(filepath);
            expect(content.toString()).toBe('Foo Bar');
            del([filepath]);
            done();
        },
        function(err) {
            done(err);
        }
    );
});

test('readdir', function(done) {
    _.readdir(path.resolve(__dirname, 'fixtures/foo')).then(
        function(info) {
            expect(info.length).toBe(1);
            done();
        },
        function(err) {
            done(err);
        }
    );
});

test('lstat', function(done) {
    _.lstat(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(
        function(info) {
            expect(info.nlink).toBe(1);
            done();
        },
        function(err) {
            done(err);
        }
    );
});

test('readFile', function(done) {
    _.readFile(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(
        function(info) {
            expect(!!~info.indexOf('Foo Bar')).toBe(true);
            done();
        },
        function(err) {
            done(err);
        }
    );
});

test('del', function(done) {
    _.del([
        path.resolve(__dirname, 'fixtures/write/1/test.txt')
    ]).then(files => {
        expect(files.length).toBeDefined();
        done();
    });
});

test('readJSONFile', function() {
    return _.readJSONFile(
        path.join(__dirname, 'fixtures', 'foo.json')
    ).then(function(json) {
        expect(json.foo).toBe('bar');
    });
});
