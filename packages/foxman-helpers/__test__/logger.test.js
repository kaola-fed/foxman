const { logger: _ } = require('../lib');

test('warn', function() {
    _.warn('');
});

test('log', function() {
    _.info('1');
});

test('success', function() {
    _.success('');
});

test('error', function() {
    _.error(new Error('1'));
});
