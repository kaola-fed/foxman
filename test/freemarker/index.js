require('babel-polyfill');
var assert = require('assert');
var path = require('path');
var RenderUtil = require('../../src/helper').freemarker;

var viewDir = './view/';
var viewRoot = path.resolve(__dirname, viewDir);

var renderUtil = new RenderUtil({
  viewRoot: viewRoot
});
describe('freemarker', function() {
    it('parse1', function(done) {
      renderUtil.parse(path.join(viewRoot, 'foo.ftl'), {}).then((info) => {
        assert.equal(!!(~info.content.indexOf('Foo Bar')),  1);
        done();
      }, function (err) {
        done(err);
      })
    });

    it('parse2', function(done) {
      renderUtil.parse(path.join(viewRoot, 'bar.ftl'), {foo:' bar'}).then((info) => {
        assert.equal(!!(~info.content.indexOf('bar')),  1);
        done();
      }, function (err) {
        done(err);
      })
    });

    it('stringify', function(done) {
      var json = {foo: {
        foo: "bar"
      }};
      var jsonText = JSON.stringify({foo: "bar"});
      renderUtil.parse(path.join(viewRoot, 'stringify.ftl'), json).then((info) => {
        assert.equal(JSON.stringify(JSON.parse(info.content)), jsonText);
        done();
      }, function (err) {
        done(err);
      })
    });
});
