var path = require('path');
var fs = require('../lib').fs;

test('writeUnExistsFile', function(done) {
    fs.writeUnExistsFile(path.resolve(__dirname, 'fixtures/foo/bar.txt'),'Foo Bar').then(function (info) {
        expect(!!~info.indexOf('Foo Bar')).toBe(true);
        done();
    }, function (err) {
        done(err);
    });
});

test('getDirInfo', function(done) {
    fs.getDirInfo(path.resolve(__dirname, 'fixtures/foo')).then(function (info) {
        expect(info.length).toBe(1);
        done();
    }, function (err) {
        done(err);
    });
});

test('getFileStat', function(done) {
  fs.getFileStat(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(function (info) {
    expect(info.nlink).toBe(1);
    done();
  }, function (err) {
    done(err);
  });
});

test('readFile', function(done) {
  fs.readFile(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(function (info) {
    expect(!!~info.indexOf('Foo Bar')).toBe(true);
    done();
  }, function (err) {
    done(err);
  });
});

test('delDir', function() {
  expect(fs.delDir(path.resolve(__dirname, 'fixtures/foo/bar.txt'))).toBe(undefined);
});
