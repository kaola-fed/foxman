// require('babel-polyfill')
var assert = require("assert");
var path = require("path");
var Application = require('../../src/application/application').default;
var Nei = require('../../src/plugins/nei').default;
var Reloader = require('../../src/plugins/reloader').default;
var WatchPlugin = require('../../src/plugins/watcher').default;
var ServerPlugin = require('../../src/plugins/server').default;

var app = new Application();
app.setConfig({
  argv:{
    update: 0
  }
})
var syncPath = path.join(__dirname, 'mock', 'sync');
var asyncPath = path.join(__dirname, 'mock', 'async');

describe('Use Plugins', function() {

  it('Use WatcherPlugin', function () {
      app.use(new WatchPlugin({}));
      assert.equal(!!app.dI.dependency.watcherPlugin, 1);
  });


  it('Use ServerPlugin', function () {
      app.use(new ServerPlugin({
          routers:[],
          port: 9000,
          divideMethod: false,
          viewRoot: path.join(__dirname, 'template'),
          syncData: syncPath,
          asyncData: asyncPath,
          static: [
              path.join(__dirname, 'src')
          ]
      }));
      assert.equal(!!app.dI.dependency.serverPlugin, 1);
  });


  it('Use ReloaderPlugin', function () {
      app.use(new Reloader({}));
      assert.equal(!!app.dI.dependency.reloaderPlugin, 1);
  });
});

describe('Application Run', function (){
    it('Application run', function () {
        app.run();
        assert.equal(1, 1);
    });
});

describe('Server Plugin Function', function (){
    it('server.syncDataMatch', function () {
        var url = app.dI.dependency.serverPlugin.server.syncDataMatch('foo.json')
        assert.equal(url, path.join(syncPath, 'foo.json'));
    });

    it('server.asyncDataMatch', function () {
        var url = app.dI.dependency.serverPlugin.server.syncDataMatch('foo.json')
        assert.equal(url, path.join(syncPath, 'foo.json'));
    });
});
