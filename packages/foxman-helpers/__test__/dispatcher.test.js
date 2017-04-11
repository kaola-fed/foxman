var path = require('path');
var apiHandler = require('../lib/apiHandler');

test('apiHandler', function(done) {
  var combine = apiHandler({
    dataPath: [
      path.resolve(__dirname, 'fixtures/dispatcher/foo/foo.json'),
      path.resolve(__dirname, 'fixtures/dispatcher/foo/bar.json')
    ]
  }).then(info => {
    expect(info.json.foo).toBe('bar');
    done();
  }, function () {
    done();
  });
});
