var assert = require('assert');
var path = require('path');
// require('babel-polyfill');
var apiHandler = require('../../dist/helper/apiHandler').default;

describe('dispatcher', function() {
    it('apiHandler', function(done) {
      var combine = apiHandler({
        dataPath: [
          path.resolve(__dirname, 'foo/foo.json'),
          path.resolve(__dirname, 'foo/bar.json')
        ]
      }).then(info => {
        assert.equal(info.json.foo, 'bar');
        done();
      });
    });
});
