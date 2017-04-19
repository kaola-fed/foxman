var path = require('path');
var apiHandler = require('../lib/utils/apiHandler');

test('apiHandler', function() {
  var combine = apiHandler({
    dataPath: [
      path.resolve(__dirname, 'fixtures/dispatcher/foo/foo.json'),
      path.resolve(__dirname, 'fixtures/dispatcher/foo/bar.json')
    ]
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('apiHandler-sigleDataPath', function() {
  var combine = apiHandler({
    dataPath: path.resolve(__dirname, 'fixtures/dispatcher/foo/bar.json')
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});


test('apiHandler-PromiseHandler', function() {
  return apiHandler({
    handler: function () {
      return Promise.resolve({
        foo: 'bar'
      })
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('apiHandler-handler', function() {
  return apiHandler({
    handler: function () {
      return {
        foo: 'bar'
      }
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

test('apiHandler-handlerString', function() {
  return apiHandler({
    handler: function () {
      return JSON.stringify({
        foo: 'bar'
      })
    }
  }).then(info => {
    expect(info.json.foo).toBe('bar');
  });
});

