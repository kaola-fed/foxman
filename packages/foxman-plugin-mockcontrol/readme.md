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
            /**
             * 在 mock json 的同目录下找，文件名一样 的 .js 文件
             * @param dataPath
             * @returns {string|*|XML|void}
             */
            mapJS: function (dataPath) {
                return dataPath.replace(/\.json$/, '.js');
            }
        })
    ],
    ...
}
```

## 三种 MockControl JS 的书写方式
需要在 MockData.json 同目录下创建同文件名的 .js 文件，有三种方式可以应对不同的需求场景：

### 方式一、exports function
> 需求场景: 根据请求响应特定的结构（一般场景）
```javascript
function response(data, request) {
    if (request.query.ok) {
        data.ok = request.query.ok;
    }
    // return data;
};
module.exports = response;
```

### 方式二、exports 有 return 的 generator
> 需求场景: 模拟超时
```javascript
function response(data) {
    yield new Promise((resolve) => {
        setTimeout(function () {
            resolve(0);
        }, 3000);
    });

    return data;
};
module.exports = response;
```


### 方式三、exports 无 return 的 generator
> 需求场景: jsonp 响应
```javascript
function response(data) {
    yield new Promise((resolve) => {
        setTimeout(function () {
            resolve(0);
        }, 3000);
    });

    this.body = `callback(${JSON.stringify(data)})`;
};
module.exports = response;
```

> 需求场景: 下载文件
```javascript
const fs = require('fs');
const path = require('path');

module.exports = function * (data) {
    this.body = fs.createReadStream(path.join(__dirname, './jsonp.demo.js'));
};
```

方式二与方式三的区别是：
1. 方式二，结束完 generator 后，继续走 Foxman 后续的中间件，最终渲染还是由 Foxman 决定；
2. 方式三，结束完 generator，不继续进行后续的中间件处理，直接渲染响应。

[查看例子](./example/)
