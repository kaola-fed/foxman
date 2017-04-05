## 如何编写一个贴合工程开发情况的 Foxman 配置文件？

### **Foxman** 目前具备以下主要功能
- [Server](./plugins/Server.md)
    - 静态资源
    - Mock
    - [渲染引擎](./plugins/TemplateRender.md)
- [处理器](./plugins/Processor.md)
- [文件自动刷新](./plugins/LivingReload.md)
- [Proxy](./plugins/Proxy.md)
- [NEI](./plugins/NEI.md)
- [插件（可自由定制）](http://github.com/foxman-plugins)
    * [RouteDisplay](https://github.com/foxman-plugins/RouteDisplay)（展示当前路由列表）
    * [MockControl](https://github.com/foxman-plugins/MockControl)（Mock功能增强）

### 基础的 Foxman 使用

#### 第一步、在你的工程路径下创建 foxman.config.js，并添加以下基础内容

```javascript
const path = require('path');
module.exports = {
    server: {
        routers: [{
              method: 'GET',
              url: '/foo.html',
              sync: true,
              filepath: 'foo.ftl' // 当前路径 ./template/ 文件夹下添加
          }, {
               method: 'POST',
               url: '/bar.html',
               sync: false,
               filepath: 'bar.json'
           }
        ],
        port: 9999,
        viewRoot: path.resolve(__dirname, 'template'), // 模板根路径
        syncData: path.resolve(__dirname, 'mock/sync/'), // 同步数据根路径
        asyncData: path.resolve(__dirname, 'mock/async'), // 异步数据根路径
        static: [ 
            path.resolve(__dirname, './src') // 静态资源根路径
        ]
    }
};
```
#### 第二步、创建第一个例子
```bash
$ cd /path/to/yourproject 
```
##### 1. touch `./template/foo.ftl`
```html
Hello ${foo!"Foxman"}
```
##### 2. touch `./mock/sync/foo.json`
```json
{
  "foo": "bar"
}
```

##### 3. touch `./mock/async/bar.json`
```json
{
  "bar": "foo"
}
```

#### 第三步、启动
```bash
$ foxman
```