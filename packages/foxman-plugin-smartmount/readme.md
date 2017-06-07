# @foxman/plugin-smartmount

like @foxman/plugin-smartmount but with different api

## install

cd project dir

```
npm i --D foxman @foxman/plugin-smartmount
```

foxman.config.js:

```js
const SmartMount = require('@foxman/plugin-smartmount');
module.exports = {
    ...
    plugins: [
        new SmartMount({
            /**
             * urlMap
             * 1.key为url，value为mock的ftl文件路径(ftl文件和同步数据json文件的相对路径一致)
             * 2.value不用加上后缀.ftl，为相对于viewRoot(syncData)的相对路径
             */
            urlMap: {// { url: mockFilePath }
                // // 第1种：常规型
                // '/index.html': 'pages/index',
                // // 第2种：匹配型
                // '/orders/detail/:odId(\\d+).html': 'pages/order/detail'
                '/h5.html': 'h5/index',
                '/pc.html': 'pc/index'
            },
            /**
             * 补充urlMap
             * 根据已经有的mock文件，补充urlMap
             * @param syncFilePath
             * @return {string|array|*}
             */
            replenishUrlMap(syncFilePath){
                return [
                    // `/${syncFilePath}`,
                    `/${syncFilePath}.html`
                ];
            },
            /**
             * apiMap
             * 1.key位异步接口的地址，value位mock文件路径
             * 2.mock文件路径不用写.json后缀，为相对于asyncData的相对路径
             */
            apiMap: { // { api: dataFilePath }
                // // 第1种：常规型
                'GET /a/b/c': 'api/a/b/c',
                // // 第2种：匹配型
                // 'GET /foo/:bar/:id(\\d+)': 'api/foo/bar/com'
            },
            /**
             * 补充apiMap
             * 根据已经有的mock文件，补充apiMap，即mock文件反推url
             * @param asyncFilePath
             * @return {string|array|*}
             */
            replenishApiMap(asyncFilePath){
                return `/${asyncFilePath}`;
            },
            /**
             * 需要排除扫描的文件
             */
            excludePatterns: {
                urlTpl: [
                    '!com/**/*.ftl',
                    '!**/**/macro.ftl'
                ],
                apiJson: []
            }
    ],
    ...
}
```

### difference between @foxmam/plugin-automount & @foxmam/plugin-smartmount

SmartMount plugin feature:

1. support ```excludePatterns``` to ignore mock files whitch you don't wanna care

2. support ```apiMap``` to diy some special api mock rules

3. ```urlMap``` & ```apiMap``` config direction: from url(apiPath) to mock file

4. ```replenishUrlMap``` & ```replenishApiMap``` config direction: from local mock file(json or ftl) to url(apiPath)

5. ```default asyncData dir structure``` like this:

```
/async
  │
  ├── delete
  │     └──/*.json|js  DELETE 请求所对应的数据
  │
  ├── get
  │     └──/*.json|js  GET 请求所对应的数据
  │
  ├── post
  │     └──/*.json|js  POST 请求所对应的数据
  │
  ├── put
  │     └──/*.json|js  PUt请求所对应的数据
  │
  └──/*.json|js  根目录下的文件，会被默认处理成为‘GET 请求所对应的数据’，不推荐放在这里
```


[查看例子](../../example/foxman.config.js)
