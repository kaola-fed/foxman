const _ = require('../lib').util;
const path = require('path');

test('createSystemId', function() {
    const f = _.createSystemId();
    const num = parseInt(Math.random() * 100);
    for (var i = 0; i < num; i++) {
        f();
    }
    expect(f()).toBe(i);
});

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

test('upperCaseFirstLetter', function() {
    expect(
        /** result */
        _.upperCaseFirstLetter('hello')
    ).toBe(
        /** expectedValue */
        'Hello'
    );
});

test('firstUpperCase', function() {
    var url = 'http://www.kaola.com';
    expect(_.upperCaseFirstLetter('abb')).toBe('Abb');
});

test('removeHeadBreak', function() {
    expect(_.removeHeadBreak('\\nihao')).toBe('nihao');
    expect(_.removeHeadBreak('/nihao')).toBe('nihao');
});

test('removeSuffix', function() {
    expect(_.removeSuffix('/test/ashaioshaoishoias.json')).toBe(
        '/test/ashaioshaoishoias'
    );
});

test('removeSuffix2', function() {
    expect(_.removeSuffix('/test/ashaioshaoishoias.json', 'json')).toBe(
        '/test/ashaioshaoishoias'
    );
});

test('removeSuffix3', function() {
    expect(_.removeSuffix('/test/foo.bar', 'json')).toBe('/test/foo.bar');
});

test('compressHtml', function() {
    expect(
        /** result */
        _.compressHtml(
            `
hello Jack
`
        )
    ).toBe(
        /** expectedValue */
        'hello Jack'
    );
});

it('readJSONFile', function() {
    return _.readJSONFile(
        path.join(__dirname, 'fixtures', 'foo.json')
    ).then(function({ json }) {
        expect(json.foo).toBe('bar');
    });
});

test('lowerCaseFirstLetter', function() {
    expect(
        /** result */
        _.lowerCaseFirstLetter('Hello')
    ).toBe(
        /** expectedValue */
        'hello'
    );
});

test('values', function() {
    expect(
        /** result */
        _.values({ a: 1 })[0]
    ).toBe(
        /** expectedValue */
        1
    );
});

test('addDataExt', function() {
    expect(
        /** result */
        _.addDataExt('1')
    ).toBe(
        /** expectedValue */
        '1.json'
    );

    expect(
        /** result */
        _.addDataExt('1.json')
    ).toBe(
        /** expectedValue */
        '1.json'
    );
});

test('jsonPathResolve', function() {
    expect(_.jsonPathResolve('/test/ashaioshaoishoias')).toBe(
        'test/ashaioshaoishoias.json'
    );
});

test('appendHeadBreak', function() {
    expect(_.appendHeadBreak('buisagsa')).toBe('/buisagsa');
});

test('typeof', function() {
    expect(_.typeOf({})).toBe('object');
});

test('sha1', function() {
    var a = 'nihao';
    expect(_.sha1(a)).toBe('23fcf96d70494b81c5084c0da6a6e8d84a9c5d20');
});

test('parseJSON', function() {
    expect(_.parseJSON('{a:1}').a).toBe(1);
});

test('ensureArray', function() {
    expect(_.ensureArray(1)[0]).toBe(1);
});
