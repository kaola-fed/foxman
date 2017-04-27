const {system: _} = require('../lib')

test('notify', function() {
    const title = 'hello';
    const msg = 'world';
    expect(
        /** result */
        _.notify({
            title,
            msg
        })
    ).toBe(
        /** expectedValue */
        0
    );
});

test('createSystemId', function() {
    const f = _.createSystemId();
    const num = parseInt(Math.random() * 100);
    for (var i = 0; i < num; i++) {
        f();
    }
    expect(f()).toBe(i);
});


test('checkVersion', function () {
    expect(
        /** result */
        _.checkVersion({ version: '2.0.0', versionMin: '1.0.0' })
    ).toBe(
        /** expectedValue */
        true
        );

    expect(
        /** result */
        _.checkVersion({ version: '1.0.0', versionMin: '2.0.0' })
    ).toBe(
        /** expectedValue */
        false
        );
});

test('checkVersion-prerelease', function () {
    expect(
        /** result */
        _.checkVersion({ version: '1.0.0', versionMin: '1.0.0-0' })
    ).toBe(
        /** expectedValue */
        true
        );
});