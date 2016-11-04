```
   ___                                             
 /'___\                                            
/\ \__/  ___   __  _   ___ ___      __      ___    
\ \ ,__\/ __`\/\ \/'\/' __` __`\  /'__`\  /' _ `\  
 \ \ \_/\ \L\ \/>  <//\ \/\ \/\ \/\ \L\.\_/\ \/\ \ 
  \ \_\\ \____//\_/\_\ \_\ \_\ \_\ \__/.\_\ \_\ \_\
   \/_/ \/___/ \//\/_/\/_/\/_/\/_/\/__/\/_/\/_/\/_/
```
[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

## Playground
### Features
    * mock server
    * global watcher
    * global websocket server
    * preCompilers
    * data from nei 
    * api proxy
    * living reload

### Styles
    * es6`s code style
    * dependency inject
    * pipeline plugin works
    * yield &&  generator && promise
    

## Show
![http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CB0DE48CD3184F9E9B258FD20904A8F1/7199](http://note.youdao.com/yws/public/resource/72c37299682b2a61c50c3a0513b22810/xmlnote/CB0DE48CD3184F9E9B258FD20904A8F1/7199)

## Quick start
### Installation

确认本地安装nodejs，且版本再 0.12.x以上
```bash
$ npm i -g foxman
```

### How to use

> example foxman -c config.js -u -p test

```bash
* --config: config.js  # 配置文件位置（缺省：foxman.config.js）
* --proxy: test        # 在foxman.config.js代理一栏中配置（缺省：false）
```

## Config 

配置文件格式是js，module.exports一个json。而所有的路径统一采用绝对路径的方式配置。

### Example

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
    * test String or Array<String> 需要进行转换的文件规则
    * handler  Function 类型，需返回一个数组
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
     * host request headers 上携带过去的 Host信息
     * service url处理器 foxman -p test 选中 test
     */
    proxy: {
        host: 'm.baidu.com',
        service: {
            /**
             *
             * @param url  request.url （http://m.baidu.com/(index.html?hello=world)）
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

### Details
#### PreCompiler

use vinyl-fs to output files, so we can use some plugin from gulp.

* **test** -- the glob pattern of files
* **handler** -- define **function**，**return** an **Array**, the pipeline of gulp plugins

#### Watcher
the **root** of watcher, default is **__dirname**

#### Server
* routers is an **Array** 
    * method -- GET/POST/PUT...
    * url -- the dispatcher url
    * sync -- true/false ① sync page ② async data
    * filePath -- template path or data path 
* port -- the server port
* viewRoot -- the rootdir of template
* syncData -- the rootdir of sync data
* asyncData -- the rootdir of async data
* static Array<path> resource dir

*Tips*：append **?mode=1** to url, foxman will show the sync pages of your local dir

#### Living reload
* js or css in server.static
* files in server.viewRoot 
* files in server.syncData
if the update files is end of '.css', only reload the style.

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
