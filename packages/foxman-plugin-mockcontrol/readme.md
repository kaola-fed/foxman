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

[查看例子](./example/)