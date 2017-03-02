require('colors')
var assert = require("assert");
var path = require("path");
var Application = require('../../src/Application');
var Nei = require('../../src/Plugins/NEISync').default;
var Reloader = require('../../src/Plugins/reloader').default;
var WatchPlugin = require('../../src/Plugins/watcher').default;
var ProxyPlugin = require('../../src/Plugins/proxy').default;
var ServerPlugin = require('../../src/Plugins/server').default;

var app = Application;

var syncPath = path.join(__dirname, 'mock', 'sync');
var asyncPath = path.join(__dirname, 'mock', 'async');

describe('Use Plugins', function () {

    it('Use WatcherPlugin', function () {
        app.use(new WatchPlugin({}));
        assert.equal(!!app.get('watcherPlugin'), 1);
    });


    it('Use ServerPlugin', function () {
        app.use(new ServerPlugin({
            routers: [],
            port: 9000,
            divideMethod: false,
            viewRoot: path.join(__dirname, 'template'),
            syncData: syncPath,
            asyncData: asyncPath,
            static: [
                path.join(__dirname, 'src')
            ]
        }));
        assert.equal(!!app.get('serverPlugin'), 1);
    });


    it('Use ReloaderPlugin', function () {
        app.use(new Reloader({}));
        assert.equal(!!app.get('reloaderPlugin'), 1);
    });
    it('Use ProxyPlugin', function () {
        app.use(new ProxyPlugin({}));
        assert.equal(!!app.get('proxyPlugin'), 1);
    });

});

describe('Application Run', function () {
    it('Application run', function () {
        app.run();
        assert.equal(1, 1);
    });
});

describe('Server Plugin Function', function () {
    it('server.syncDataMatch', function () {
        var url = app.get('serverPlugin').server.syncDataMatch('foo.json')
        assert.equal(url, path.join(syncPath, 'foo.json'));
    });

    it('server.asyncDataMatch', function () {
        var url = app.get('serverPlugin').server.syncDataMatch('foo.json')
        assert.equal(url, path.join(syncPath, 'foo.json'));
    });
});
