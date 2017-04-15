const { register, di, dependencies, get } = require('../lib/application/DI');

test('register', function() {
    expect(register('key', {'name': 'plugin1'})).toBe(undefined);
});

test('get', function() {
    expect(get('key').name).toBe('plugin1');
});

test('di', function() {
    expect(di(function anonymous(key) {return 0})).toBe(0);
});
