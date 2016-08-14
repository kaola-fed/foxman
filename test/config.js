var pathJoin = require('path').join;

module.exports = {
  port        : '9999',
  ftlDir      : pathJoin(__dirname, 'ftl'),             // FTL根目录
  mockFtlDir  : pathJoin(__dirname, 'mock', 'fakeData'),// FTL combine data 根目录
  mockJsonDir : pathJoin(__dirname, 'mock', 'json'),    // ajax api 目录
  static      : {
    parentDir  : __dirname,                             // 静态资源父级目录
    dirname    : 'static'                               // 静态资源目录名
  }
}