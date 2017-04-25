const {parser: _} = require('../lib')

test('parseJSON', function() {
    expect(_.parseJSON('{a:1}').a).toBe(1);
});
