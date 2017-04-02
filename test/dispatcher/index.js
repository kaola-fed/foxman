var assert = require("assert");
var path = require('path');
// require('babel-polyfill');
var dispatcher = require('../../dist/Plugins/Server/middleware/dispatcher');

describe('dispatcher', function() {
    it('apiHandler', function(done) {
      var combine = dispatcher.apiHandler({
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
