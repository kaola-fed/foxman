const {typer: _} = require('../lib');

test('values', function() {
    expect(
        /** result */
        _.values({ a: 1 })[0]
    ).toBe(
        /** expectedValue */
        1
    );
});

test('typeof', function() {
    expect(_.typeOf({})).toBe('object');
});

test('ensureArray', function() {
    expect(_.ensureArray(1)[0]).toBe(1);
});
