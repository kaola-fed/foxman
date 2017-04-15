const { register, di, dependencies } = require('../lib/DI')();

test('register', function() {
    expect(register('key', { name: 'plugin1' })).toBe(undefined);
});

test('di', function() {
    expect(
        di(function anonymous(key) {
            return 0;
        })
    ).toBe(0);
});
