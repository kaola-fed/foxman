# MockControl
> Foxman-Plugin


## 插件作用
Foxman 基础的 Mock 方式，是静态的。即，我们编写的 Mock Data JSON 长啥样，最终响应给前端的就长啥样。

但是，我们终究会遇到一些特殊的需求：
1. 根据请求对响应数据进行定制；
2. 模拟请求超时
3. Mock 文件下载功能
4. JSONP 等其他非 JSON 格式的 异步数据响应

而这个插件的作用，就是扩展 Foxman 的 Mock 数据加工的能力。

## 如何使用
1. cd `path/to/project` (已启用 foxman 的工程)
2. `npm i --save-dev @foxman/plugin-mock-control`
3. 在 `foxman.config.js` 中新增 plugins 的配置项

```javascript
const MockControl = require('@foxman/plugin-mock-control');
module.exports = {
    ...
    plugins: [
        new MockControl({
            mapJS: function (dataPath) { // (mockDATA) => mockJS
                return dataPath.replace(/\.json$/, '.js');
            }
        })
    ],
    ...
}
```

## 场景举例
```bash
$ git clone https://github.com/kaola-fed/foxman/
$ cd packages/foxman-plugin-mockcontrol/example/
$ npm i # 无梯子用户推荐 cnpm
$ npm start
```
* [根据请求来定制响应 DEMO](http://127.0.0.1:9000/example.1.ftl)
* [jsonp 响应 DEMO](http://127.0.0.1:9000/example.2.ftl)
* [下载文件 DEMO](http://127.0.0.1:9000/example.3.ftl)
* [延时响应 DEMO](http://127.0.0.1:9000/example.4.ftl)
* [延时响应 + JSONP DEMO](http://127.0.0.1:9000/example.5.ftl)

## OPTIONS
```javascript
plugins: [
    new MockControl({
        mapJS: function (dataPath) { // (mockDATA) => mockJS
            return dataPath.replace(/\.json$/, '.js');
        }
    })
],
```
* mapJS - 从 Mock Data 到 Mock JS 的映射方式，缺省为 `.json` 同名 `.js` 文件 

## Mock JS 能力说明
* this 指向 koa 中间件的 this
```js
module.exports = function() {
    console.log(this);
}
```

* 第一个参数为， Mock Data
```js
module.exports = function(data) {
    console.log('data', data);
    return data;
}
```

⚠️ 需要 `return` Mock Data，否则会直接输出当前 `this.body`

```js
module.exports = function(data) {
    this.body = 'without return.'
}
```

* 支持 `generator`，用于处理异步的场景
```js
module.exports = function * (data) {
    yield new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    return data;
}
```

or 

```js
module.exports = function * (data) {
    yield new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    this.body = 'without return.'
}
```