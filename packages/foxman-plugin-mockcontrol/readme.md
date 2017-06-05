# MockControl
> Foxman-Plugin

## 如何启用
1. cd path/to/project(以启用 foxman 的工程)
2. npm i --save-dev foxman-plugin-mock-control
3. 在 foxman.config.js 中新增 plugins 的配置项

```javascript
const MockControl = require('foxman-plugin-mock-control');
module.exports = {
    ...
    plugins: [
        new MockControl({
            mapJS: function (dataPath) {
                return dataPath.replace(/\.json$/, '.js');
            }
        })
    ],
    ...
}
```

## 如何编写控制响应的 js
需要在 MockData.json 同目录下创建同文件名的 .js 文件，有四种方式可以应对不同的适用场景：

### 方式一、export function，有 return 值
> 适用场景: 根据请求响应特定的结构（一般场景）
```javascript
module.exports = function (data, request) {
    if (request.query.ok) {
        data.ok = request.query.ok;
    }

    return data;
};;
```

### 方式二、export function，无 return 值 
> 适用场景: jsonp 响应
```javascript

module.exports = function * (data) {
    this.body = `callback(${JSON.stringify(data)})`;
};
module.exports = response;
```

> 适用场景: 下载文件
```javascript
const fs = require('fs');
const path = require('path');

module.exports = function * (data) {
    this.body = fs.createReadStream(path.join(__dirname, './jsonp.demo.js'));
};
```

### 方式三、export generator，有 return 值
> 适用场景: 模拟超时
```javascript
module.exports = function * (data) {
    yield new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    return data;
};
```

### 方式四、export generator，无 return 值
> 适用场景: 模拟超时，且 js 自由控制响应
```javascript
module.exports = function * (data) {
    yield new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    this.body = `callback(${JSON.stringify(data)})`;
};
```

[查看例子](./example/)
