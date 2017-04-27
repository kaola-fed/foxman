var path = require('path');
var fetch = require('../lib/fetch');

test('fetch', function() {
  var combine = fetch({
    dataPath: [
      path.resolve(__dirname, 'fixtures/dispatcher/foo/foo.json'),
      path.resolve(__dirname, 'fixtures/dispatcher/foo/bar.json')
    ]
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('fetch-sigleDataPath', function() {
  var combine = fetch({
    dataPath: path.resolve(__dirname, 'fixtures/dispatcher/foo/bar.json')
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});


test('fetch-PromiseHandler', function() {
  return fetch({
    handler: function () {
      return Promise.resolve({
        foo: 'bar'
      })
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('fetch-handler', function() {
  return fetch({
    handler: function () {
      return {
        foo: 'bar'
      }
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('fetch-handlerString', function() {
  return fetch({
    handler: function () {
      return JSON.stringify({
        foo: 'bar'
      })
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

