const path = require('path');
const {fs: _} = require('../lib');

test('writeUnExistsFile', function(done) {
    _.writeUnExistsFile(path.resolve(__dirname, 'fixtures/foo/bar.txt'),'Foo Bar').then(function (info) {
        expect(!!~info.indexOf('Foo Bar')).toBe(true);
        done();
    }, function (err) {
        done(err);
    });
});

test('getDirInfo', function(done) {
    _.getDirInfo(path.resolve(__dirname, 'fixtures/foo')).then(function (info) {
        expect(info.length).toBe(1);
        done();
    }, function (err) {
        done(err);
    });
});

test('getFileStat', function(done) {
  _.getFileStat(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(function (info) {
    expect(info.nlink).toBe(1);
    done();
  }, function (err) {
    done(err);
  });
});

test('readFile', function(done) {
  _.readFile(path.resolve(__dirname, 'fixtures/foo/bar.txt')).then(function (info) {
    expect(!!~info.indexOf('Foo Bar')).toBe(true);
    done();
  }, function (err) {
    done(err);
  });
});

test('delDir', function() {
  expect(_.delDir(path.resolve(__dirname, 'fixtures/foo/bar.txt'))).toBe(undefined);
});

test('readJSONFile', function() {
    return _.readJSONFile(
        path.join(__dirname, 'fixtures', 'foo.json')
    ).then(function({ json }) {
        expect(json.foo).toBe('bar');
    });
});

