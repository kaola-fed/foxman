const {logger: _} = require('../lib')

test('debugLog', function() {
    expect(
        /** result */
        _.debugLog('')
    ).toBe(
        /** expectedValue */
        0
    );
});

test('log', function() {
    expect(
        /** result */
        _.log('1')
    ).toBe(
        /** expectedValue */
        0
    );
});
