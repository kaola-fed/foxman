const formatStaticOptions = require('../lib/utils/formatStaticOptions');
const path = require('path');

const joinCrt = dir => {
    return path.join(process.cwd(), dir);
}

const dirname = 'a';

test('formatStaticOptions-0', function () {
    const instance = formatStaticOptions(dirname);
    expect(instance.dir).toBe(joinCrt(dirname));
    expect(instance.prefix).toBe('/' + dirname);
    expect(instance.filter('node_modules')).toBe(false);
})

test('formatStaticOptions-1', function () {
    expect(formatStaticOptions({
        dir: dirname
    }).dir).toBe(joinCrt(dirname));
})
