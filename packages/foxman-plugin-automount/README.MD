# Automount
> Foxman-Plugin

## 如何启用
1. cd path/to/project(以启用 foxman 的工程)
2. npm i --save-dev foxman-plugin-automount
3. 在 foxman.config.js 中新增 plugins 的配置项
```javascript
const Automount = require('foxman-plugin-automount');
module.exports = {
    ...
    plugins: [
        new Automount({
            tplUrlMap: {
                '/index.html': 'index',
                '/index2.html': 'index',
            },
            /**
             * 同步接口 xxx.ftl 映射实际url的接口，默认如下
             * @param ftlPath(不带后缀)
             * @returns {string|*|XML|void} 
             */
            syncDataMatch: ftlPath => { 
                return '/' + ftlPath + '.html'; 
            },
            /**
             * 异步接口 xxx.json 映射实际url的接口，默认如下
             * @param dataPath(不带后缀)
             * @returns {string|*|XML|void} 
             */
            asyncDataMatch: dataPath => {
                return '/' + dataPath + '.html'; 
            }
        })
    ],
    ...
}
```

[查看例子](./example/)
