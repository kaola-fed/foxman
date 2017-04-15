const checkNodeVersion = require('../bin/check-node-version');

test('checkNodeVersion', function() {
     expect(checkNodeVersion()).toBe(true);
});