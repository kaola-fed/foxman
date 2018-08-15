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

test('removeLeadingSlash', function() {
    expect(_.removeLeadingSlash('\\nihao')).toBe('nihao');
    expect(_.removeLeadingSlash('/nihao')).toBe('nihao');
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

test('ensureJSONExtension', function() {
    expect(
        /** result */
        _.ensureJSONExtension('1')
    ).toBe(
        /** expectedValue */
        '1.json'
    );

    expect(
        /** result */
        _.ensureJSONExtension('1.json')
    ).toBe(
        /** expectedValue */
        '1.json'
    );

    expect(
        /** result */
        _.ensureJSONExtension('1.jsona')
    ).toBe(
        /** expectedValue */
        '1.jsona.json'
    );
});

test('jsonPathResolve', function() {
    expect(_.jsonPathResolve('/test/ashaioshaoishoias')).toBe(
        'test/ashaioshaoishoias.json'
    );
});

test('ensureLeadingSlash', function() {
    expect(_.ensureLeadingSlash('buisagsa')).toBe('/buisagsa');
});