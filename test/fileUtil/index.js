var assert = require('assert');
var path = require('path');
var util = require('../../src/helper').util;
var fileUtil = require('../../src/helper').fileUtil;

describe('fileUtil', function() {
  
    it('writeUnExistsFile', function(done) {
      fileUtil.writeUnExistsFile(path.resolve(__dirname, 'foo/bar.txt'),'Foo Bar').then(function (info) {
        assert.equal(!!~info.indexOf('Foo Bar'), 1);
        done();
      }, function (err) {
        done(err);
      });
    });

    it('getDirInfo', function(done) {
        fileUtil.getDirInfo(path.resolve(__dirname, 'foo')).then(function (info) {
            assert.equal(info.length, 1);
            done();
        }, function (err) {
            done(err);
        });
    });

    it('getFileStat', function(done) {
      fileUtil.getFileStat(path.resolve(__dirname, 'foo/bar.txt')).then(function (info) {
        assert.equal(info.nlink, 1);
        done();
      }, function (err) {
        done(err);
      });
    });

    it('readFile', function(done) {
      fileUtil.readFile(path.resolve(__dirname, 'foo/bar.txt')).then(function (info) {
        assert.equal(!!~info.indexOf('Foo Bar'), 1);
        done();
      }, function (err) {
        done(err);
      });
    });

    it('delDir', function() {
      assert.equal(fileUtil.delDir(path.resolve(__dirname, 'foo/bar.txt')), undefined);
    });

});
