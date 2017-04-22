const createRegistry = require('../lib/createRegistry');
const registrySystem = createRegistry();
const fn = function (){};

test('register', () => {
    registrySystem.register('a', fn);
    expect(1).toBe(1);
});

test('all', () => {
    const _all = registrySystem.all();
    expect(_all.a).toBe(fn);
});

test('lookup', () => {
    const _fn = registrySystem.lookup('a');
    expect(_fn).toBe(fn);
});

test('unregister', () => {
    registrySystem.unregister('a');
    const _fn = registrySystem.lookup('a');
    expect(_fn).toBe(undefined);
});

