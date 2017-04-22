const path = require('path');
const {
    getTemplatePattern,
    getResourcesPattern,
    getSyncDataPattern
} = require('../lib/patterns');

test('getTemplatePattern', () => {
    const list = getTemplatePattern({
        extension: 'ftl',
        viewRoot: __dirname,
        templatePaths: []
    });
    expect(list[0]).toBe(path.join(__dirname, '**', '*.ftl'))
});

test('getResourcesPattern', () => {
    const list = getResourcesPattern([{
        dir: __dirname
    }]);
    expect(list[0]).toBe(path.join(__dirname, '**', '*.css'))
    expect(list[1]).toBe(path.join(__dirname, '**', '*.js'))
    expect(list[2]).toBe(path.join(__dirname, '**', '*.html'))
});

test('getSyncDataPattern', () => {
    expect(getSyncDataPattern(__dirname)).toBe(path.join(__dirname, '**', '*.json'))
});
