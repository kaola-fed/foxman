# RouteDisplay
> Foxman-Plugin

## 如何启用
1. cd path/to/project(以启用 foxman 的工程)
2. npm i --save-dev foxman-plugin-route-display
3. 在 foxman.config.js 中新增 plugins 的配置项
```javascript
const RouteDisplay = require('foxman-plugin-route-display');
module.exports = {
    ...
    plugins: [
        new RouteDisplay()
    ],
    ...
}
```
