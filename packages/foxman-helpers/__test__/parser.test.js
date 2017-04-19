const {parser: _} = require('../lib')
const path = require('path');
const {Render} = _;

const viewDir = 'fixtures/freemarker/view/';
const viewRoot = path.resolve(__dirname, viewDir);
const render = new Render({
    viewRoot: viewRoot
});


test('parseJSON', function() {
    expect(_.parseJSON('{a:1}').a).toBe(1);
});

test('parse1', function (done) {
    render.parse(path.join(viewRoot, 'foo.ftl'), {}).then((info) => {
        expect(!!(~info.indexOf('Foo Bar'))).toBe(true);
        done();
    }, function (err) {
        done(err);
    });
});

test('parse2', function (done) {
    render.parse(path.join(viewRoot, 'bar.ftl'), {foo: ' bar'}).then((info) => {
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
    render.parse(path.join(viewRoot, 'stringify.ftl'), json).then((info) => {
        expect(JSON.stringify(JSON.parse(info))).toBe(jsonText);
        done();
    }, function (err) {
        done(err);
    });
});
