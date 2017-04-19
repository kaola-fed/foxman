const {encrypt:_} = require('../lib');

test('sha1', function() {
    var a = 'nihao';
    expect(_.sha1(a)).toBe('23fcf96d70494b81c5084c0da6a6e8d84a9c5d20');
});
