const {JSON: _} = require('../lib')

test('parseJSON', function() {
    expect(_.parse('{a:1}').a).toBe(1);
});
