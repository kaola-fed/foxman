# a flexiable mock data server 4 front-end engineer. 

# usage

1. npm install -g foxman
2. create config.js
```javascript 
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
```
3. foxman --config ./config.js