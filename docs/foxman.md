## 如何编写一个贴合工程开发情况的 Foxman 配置文件？

### **Foxman** 目前具备以下主要功能
- [Server](./plugins/server.md)
    - 静态资源
    - Mock
    - [渲染引擎](./plugins/TemplateRender.md)
- [预处理器](./plugins/PreCompiler.md)
- [预处理器](./plugins/PreCompiler.md)
- [文件自动刷新](./plugins/LivingReload.md)
- [Proxy](./plugins/Proxy.md)
- [NEI](./plugins/NEI.md)
- [插件（可自由定制）](http://github.com/foxman-plugins)
    * [RouteDisplay](https://github.com/foxman-plugins/RouteDisplay)（展示当前路由列表）
    * [MockControl](https://github.com/foxman-plugins/MockControl)（Mock功能增强）

### 基础的 Foxman 配置
```javascript
const path = require('path');
module.exports = {
    /** nei: { key: 'xxxxxxxx' }, **/
    plugins: [],
    preCompilers: [],
    server: {
        routers: [],
        port: 9999,
        viewRoot: path.resolve(__dirname, 'template'),
        syncData: path.resolve(__dirname, 'mock/sync/'),
        asyncData: path.resolve(__dirname, 'mock/async'),
        static: [ 
            path.resolve(__dirname, './src')
        ]
    }
};
```