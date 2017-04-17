const welcome = require('../bin/welcome');
test('welcome', function() {
    return expect(welcome()).toBe(0)
})