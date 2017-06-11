# MockControl
> 扩展 Foxman 基础的 Mock 方式

## 插件作用
Foxman 基础的 Mock 方式，是返回静态的 json。但是，我们终究会遇到一些特殊的需求：
1. 根据请求对响应数据进行定制；
2. 模拟请求超时
3. Mock 文件下载功能
4. JSONP 等其他非 JSON 格式的 异步数据响应

而这个插件的作用，就是扩展 Foxman 的 Mock 数据加工的能力。

## DEMO 演示
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

## 如何引入
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
* mapJS - 从 Mock Data 文件到 Mock JS 文件的映射方式，缺省为与 `.json` 同名 `.js` 文件 

## Mock JS 能力说明
* this 指向 koa 当前请求的 context
```js
module.exports = function () {
    console.log(this);
}
```

* 第一个参数为 mock 数据
```js
module.exports = function (data) {
    console.log('data', data);
}
```

* 当方法体 return 对象时，会用于后续的页面渲染
```js
module.exports = function (data) {
    return data;
}
```

* 当方法体不 return 对象时，则不再执行后续中间件。此时，可以指定 `this.body`
```js
module.exports = function (data) {
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