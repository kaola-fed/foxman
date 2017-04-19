const path = require('path');
const originalFS = require('fs');
const del = require('del');
const fs = require('../lib').fs;

test('write', function(done) {
    const filepath = path.resolve(__dirname, 'fixtures/write/1/test.txt');
    fs.write(filepath, 'Foo Bar').then(
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
    fs.readdir(path.resolve(__dirname, 'fixtures/foo')).then(
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
    fs.lstat(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(
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
    fs.readFile(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(
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
    fs
        .del([path.resolve(__dirname, 'fixtures/write/1/test.txt')])
        .then(files => {
            expect(files.length).toBeDefined();
            done();
        });
});
