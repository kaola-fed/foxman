# foxman

[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

## 工具整体介绍
目的打造一款前端开发集成工具，使老系统成员脱离本地起工程的痛苦。

* 功能
    * mock server
    * 单一 watchr（所有插件可复用）
    * 预编译器整合
    * 整合 nei
    * proxy
    * live reload

* 特点
    * es6的代码风格
    * 容器支持与依赖注入(借鉴angular service的依赖注入)
    * 插件体系，插件的内的流水线控制以及 pending 效果
    * yield + generator + promise 处理异步
    

## 界面预览
![http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CFDA84E903D44B45A4E99A2DE075F203/6722](http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CFDA84E903D44B45A4E99A2DE075F203/6722)

## api概览
### （一）安装

确认本地安装nodejs，且版本再 0.12.x以上
```bash
$ npm i -g foxman
```

### （二）命令行参数

> 例子：foxman -c config.js -u -p test

```bash
* --config: config.js  # 配置文件位置（缺省：foxman.config.js）
* --proxy: test        # 在foxman.config.js代理一栏中配置（缺省：false）
```

## 配置文件概览

配置文件格式是js，module.exports一个json。而所有的路径统一采用绝对路径的方式配置。

### 先看一个例子：

```js
'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const routers = [
    {method: 'GET', url: '/index.html', sync: true, filePath: 'page/list'},
    {method: 'GET', url: '/index2.html', sync: false, filePath: 'index'},
    {method: 'GET', url: '/home/:id', sync: true, filePath: 'page/list'},
    {method: 'POST', url: '/wxConfig.html', sync: true, filePath: 'page/wxConfig'}
];
let r = path.resolve;
let alias = {
    r: r(__dirname, 'src', 'main', 'webapp')
};

module.exports = {
    /** 如有需要，填写nei 的kei 然后执行 foxman -u 初始化工程目录。
    nei: {
        key: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    **/
    /**
    * task集合(基于gulp文件处理，故所有gulp插件都可用)
    * test -- String or Array<String> 需要进行转换的文件规则
    * handler -- Function 类型，需返回一个数组
    */
    preCompilers: [
        {
            test: [r(alias.r, 'src/mcss/**/*.mcss')],
            handler: (dest) => {
                
                return [
                    mcss({
                        "include": [],
                        "exclude": "(\\\\|\\/)_",
                        "format": 1
                    }),
                    autoprefix({
                        browsers: ['Android >= 2.3'],
                        cascade: false
                    }),
                    dest(r(alias.r, 'src/css'))
                ]
            }
        }
    ],
    /**
     * 需要watch的根目录，缺省值为 foxman.config.js 所在目录的所有文件
     */
    watch: {
        root: alias.r
    },
    /**
     * 代理配置
     * host -- request headers 上携带过去的 Host信息
     * service -- url处理器 foxman -p test 选中 test
     */
    proxy: {
        host: 'm.baidu.com',
        service: {
            /**
             *
             * @param url -- request.url （http://m.baidu.com/(index.html?hello=world)）
             * @returns 完整的请求路径
             */
            test(url){
                let devMark = 'isDev=1000';
                let result = (-1 === url.indexOf('?') ? `?${devMark}` : `&${devMark}`);
                return 'http://m.baidu.com/' + url.replace(/^\//, '') + result;
            }
        }
    },
    /**
     * mock服务器配置
     */
    server: {
        /**
         * 路由表 格式参见 @routers
         */
        routers,
        /**
         * 端口
         */
        port: 8080,
        /**
         * router type 为 sync 的filePath的ftl相对目录
         */
        viewRoot: r(alias.r, 'WEB-INF'),
        /**
         * router type 为 sync 的filePath的data相对目录
         */
        syncData: r(__dirname, 'mock/fakeData'),
        /**
         * router type 为 async 的filepath的data相对目录
         */
        asyncData: r(__dirname, 'mock/json'),
        /**
         * 静态资源目录
         */
        static: [
            r(alias.r, 'src'),
            r(alias.r, 'res')
        ]
    }
};
```

## 以下分模块来介绍配置
### preCompilers

预处理器，基于gulp的文件处理模块 vinyl-fs，故可用一些gulp的插件

* **test** 支持 glob 模式的路劲匹配
* **handler** 定义一个 **function**，**return** 出一个数组，流式的中间件体系。内每一项都是一个foxman插件，目前仅有一个foxman-mcss，之后会开放插件书写标准。

### watch
**root** 文件监听根目录，缺省为当前目录

### server
* routers 
    * method 拦截的方法
    * url 拦截的url
    * sync true/false ① 渲染ftl ② 返回json
    * filePath ① ftl（省略后缀） ②json地址（省略后缀）
* port 端口号
* viewRoot 模板根目录
* syncData 同步数据根目录
* asyncData 异步数据跟目录
* static Array<path> 静态资源目录

*小技巧*：url后带上 **?mode=1** 会以 目录 和 ftl 为维度进行 **response**

### proxy
* host

代理转发的给目标服务器时带在 header 上的"Host"属性

* service Object
    * key：String 类型，代理的配置信息，如 test， 则可以使用 foxman -p test 启用
    * value: function 类型，传参是每次请求的url，执行该function return一个目标url即为代理目标地址
    
**建议**：配置一个service即可，使用本地切换host的方式实现代理到不同的服务器或后端主机

### live reload
监听目标：

* server.static 下的js 及 css文件
* server.viewRoot 下文件
* server.syncData 下文件。
如果是css文件的变化，会只reload该样式文件，其余的会reload整个页面

## 现状与下一个小目标
![https://camo.githubusercontent.com/f0d194fd0e30506cf9cd512d06af7c57cf688a50/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f666f786d616e2e737667](https://camo.githubusercontent.com/f0d194fd0e30506cf9cd512d06af7c57cf688a50/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f666f786d616e2e737667)
![https://camo.githubusercontent.com/6d21e65e073343361af40dd89fc2bf1320bb569e/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f666f786d616e2e737667](https://camo.githubusercontent.com/6d21e65e073343361af40dd89fc2bf1320bb569e/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f666f786d616e2e737667)

![https://camo.githubusercontent.com/ab19841049769cdef8f9f3a10961c6be76b70e02/68747470733a2f2f6e6f6465692e636f2f6e706d2f666f786d616e2e706e673f646f776e6c6f6164733d7472756526646f776e6c6f616452616e6b3d747275652673746172733d74727565](https://camo.githubusercontent.com/ab19841049769cdef8f9f3a10961c6be76b70e02/68747470733a2f2f6e6f6465692e636f2f6e706d2f666f786d616e2e706e673f646f776e6c6f6164733d7472756526646f776e6c6f616452616e6b3d747275652673746172733d74727565)

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
