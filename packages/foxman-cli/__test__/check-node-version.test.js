const checkNodeVersion = require('../lib/check-node-version');

test('checkNodeVersion', function() {
     expect(checkNodeVersion()).toBe(true);
});