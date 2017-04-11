var path = require('path');
var Renderer = require('../lib').Renderer;

var viewDir = 'fixtures/freemarker/view/';
var viewRoot = path.resolve(__dirname, viewDir);

var renderer = new Renderer({
    viewRoot: viewRoot
});

test('parse1', function (done) {
    renderer.parse(path.join(viewRoot, 'foo.ftl'), {}).then((info) => {
        expect(!!(~info.indexOf('Foo Bar'))).toBe(true);
        done();
    }, function (err) {
        done(err);
    });
});

test('parse2', function (done) {
    renderer.parse(path.join(viewRoot, 'bar.ftl'), {foo: ' bar'}).then((info) => {
        expect(!!(~info.indexOf('bar'))).toBe(true);
        done();
    }, function (err) {
        done(err);
    });
});

test('stringify', function (done) {
    var json = {
        foo: {
            foo: 'bar'
        }
    };
    var jsonText = JSON.stringify({foo: 'bar'});
    renderer.parse(path.join(viewRoot, 'stringify.ftl'), json).then((info) => {
        expect(JSON.stringify(JSON.parse(info))).toBe(jsonText);
        done();
    }, function (err) {
        done(err);
    });
});
