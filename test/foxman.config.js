var path = require('path');

module.exports = {
  port: '3000',
  path: {
    root: path.join(__dirname, 'ftl'),
    syncData: path.join(__dirname, 'mock', 'fakeData'),
    asyncData: path.join(__dirname, 'mock', 'json'),
    static: [
      path.join(__dirname, 'static')
    ]
  }
};