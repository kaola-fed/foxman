const {string: _} = require('../lib')

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

test('lowerCaseFirstLetter', function() {
    expect(
        /** result */
        _.lowerCaseFirstLetter('Hello')
    ).toBe(
        /** expectedValue */
        'hello'
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