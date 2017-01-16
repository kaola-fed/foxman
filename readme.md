```
   ___                                             
 /'___\                                            
/\ \__/  ___   __  _   ___ ___      __      ___    
\ \ ,__\/ __`\/\ \/'\/' __` __`\  /'__`\  /' _ `\  
 \ \ \_/\ \L\ \/>  <//\ \/\ \/\ \/\ \L\.\_/\ \/\ \ 
  \ \_\\ \____//\_/\_\ \_\ \_\ \_\ \__/.\_\ \_\ \_\
   \/_/ \/___/ \//\/_/\/_/\/_/\/_/\/__/\/_/\/_/\/_/
```
> 不只是 Mock Server  


[![NPM][nodei-image]][nodei-url]  
[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]  

## 预览
**Foxman** 目前具备以下主要功能：  
* 服务器
    * 静态资源响应
    * **Mock Server** | **Proxy Server**
* 预编译器集成
* 代理到测试服务器或后端开发主机
* **Living reload**
* 集成 **nei**
* 插件（可自由定制）
    * 路由展示
    * 加强版 MockControl

![http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CB0DE48CD3184F9E9B258FD20904A8F1/7199](http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CB0DE48CD3184F9E9B258FD20904A8F1/7199)

## 安装
```bash
$ npm i -g foxman
```

### 配置介绍
功能 | 作用
---- | --- 
nei | 配置工程位于 [nei](https://github.com/NEYouFan/nei-toolkit) 的工程密钥，拉取数据时用
preCompilers | 预处理器配置，支持工作流，目前wap工程已用 **foxman-mcss** 及 **autoprefix**
server | 定义模板根目录以及静态资源目录 
watch | 文件监控范围配置 (缺省 foxman 启动目录)
proxy | 代理配置，用于代理到测试服务器



## 具体概念介绍（参照下文中的例子）
### nei
字段名 | 作用 | 例子
---- | --- | ---
key |  配置工程位于 nei 的 key，拉取数据时用 | xxxxxxxxxx

需要从 **nei** 上拉 **mock** 数据则
```bash
cd /path/to/工程目录
foxman -u
```

### preCompilers 
配置项是一个数组，数组每一项是独立的 **Compiler** (**Array<Compiler>**)  
以下 preCompiler 的数据结构  
字段名 | 作用 | 例子
---- | --- | ---
test | Array<path> 符合该规则会进行该编译操作 | [path.resolve(paths.webapp, 'src/mcss/**/*.mcss')]
ignore | Array<path> 符合该规则的会被忽略 | [path.resolve(paths.webapp, '**/_*.mcss')]
handler | function 类型，需要 return 一个数组，用以表示编译流| 如下

```
...略
handler: function (dest) {
    return [
        mcss({
            "include": [resolve(paths.webapp, 'src/javascript/components')],
            "format": 1
        }),
        autoprefix({
            browsers: ['Android >= 2.3'],
            cascade: false
        }),
        dest(resolve(paths.webapp, 'src/css/'))
    ]
}
...略
```
**注：**  
1. 文件匹配部分使用 **glob** 的文件匹配标准
2. foxman-mcss 支持的配置项和 mcss.json 中配置一致,不支持 exclude，使用 **igonre** 替代

### proxy
字段名 | 作用 | 例子
---- | --- | ---
host | 用以发送给测试环境时带在 request 头上，给 nginx 分发用 | m.kaola.com
service | 用以代理给指定的目标服务器，具体字段如下例子 | 如下例子
```js
...略
service: {
    local: function (url) {
        return 'http://127.0.0.1:8080/' + url;
    },
    hst_test10: function hst_test10(url) {
        return 'http://10.165.125.195/' + url;
    }
}
...略
```
启动时，如果想要代理到 **hst_test10** 服务器，则
```bash
cd /path/to/工程目录
foxman -p hst_test10
```


### server
字段名 | 作用 | 例子
---- | --- | ---
routers | 本地的 router 配置，具体结构见下文 | 见下文
port | 端口 | 9999
divideMethod | 是否区分请求方法 | false
debugTool | 是否使用 h5 的调试工具 | true
syncData | 同步接口mock数据根目录 | paths.syncData
asyncData | 异步接口mock数据根目录 | paths.asyncData
static | 静态资源根目录 Array<path> | [ paths.src, paths.res ]

#### router 结构
字段名 | 作用 | 例子
---- | --- | ---
method | 路由的请求方式 | 'GET'
url | 用于访问的 url | '/test/index.html'
sync | 是否同步接口 | true
filePath| 同步文件路径或mock数据路径 | 'pages/index.ftl'

## 举个栗子
```js
'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const routers = [];
const resolve = path.resolve;
const paths = {};
const RouteDisplay = require('foxman-plugin-route-display');
const MockControl = require('foxman-plugin-mock-control');

paths.webapp = resolve(__dirname, 'src', 'main', 'webapp');
paths.viewRoot = resolve(paths.webapp, 'WEB-INF', 'template');
paths.syncData = resolve(paths.webapp, 'mock', 'sync');
paths.asyncData = resolve(paths.webapp, 'mock', 'async');

paths.src = resolve(paths.webapp, 'src');
paths.res = resolve(paths.webapp, 'res');
paths.example = resolve(paths.webapp, 'example');

const commonUrl = function (ip) {
    return function (url) {
        return [
            'http://',
            ip,
            '/',
            url
        ].join('')
    }
};

module.exports = {
    plugins: [
        /**
        * 路由展示插件
        * /RouteDisplay 会展示当前所有路由
        */
        new RouteDisplay(),
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
    nei: {
        key: 'xxxxxxxxxxxxxxxx'
    },
    preCompilers: [
        {
            test: [resolve(paths.webapp, 'src/mcss/**/*.mcss')],
            ignore: [resolve(paths.webapp, '**/_*.mcss')],
            handler: function (dest) {
                return [
                    mcss({
                        "include": [resolve(paths.webapp, 'src/javascript/components')],
                        "format": 1
                    }),
                    autoprefix({
                        browsers: ['Android >= 2.3'],
                        cascade: false
                    }),
                    dest(resolve(paths.webapp, 'src/css/'))
                ]
            }
        }
    ],
    watch: {
        root: paths.webapp
    },
    proxy: {
        host: 'your.domain.here',
        /**
         * 代理url转换器
         * @param url
         * @returns {string}
         * 新增代理，则在 service 下新增一个 function, 启动时用 function name 启动
         * 例子： foxman -p hst_test10
         */
        service: {
            test: function (url) {
                return commonUrl('127.0.0.1:8080')(url);
            },
            hst_test10: function hst_test10(url) {
                return commonUrl('171.12.22.12')(url);
            }
        }
    },
    server: {
        routers: routers,
        port: 9999,
        divideMethod: false,
        debugTool: true,
        viewRoot: paths.viewRoot,
        syncData: paths.syncData,
        asyncData: paths.asyncData,
        static: [
            paths.src,
            paths.res,
            paths.example
        ]
    }
};


```

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
