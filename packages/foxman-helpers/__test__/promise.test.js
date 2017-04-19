const {promise: _} = require('../lib')

test('isPromise', function() {
    expect(
        /** result */
        _.isPromise(
            new Promise(function(resolve, reject) {
                resolve(0);
            })
        )
    ).toBe(
        /** expectedValue */
        true
    );
});

test('ensurePromise', function() {
    expect(
        /** result */
        _.isPromise(_.ensurePromise(1))
    ).toBe(
        /** expectedValue */
        true
    );
});
