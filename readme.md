# foxman

[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

> 前端集成开发工具，为注重开发体验的前端开发工程师量身定制 

# 预览
![http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/AB403D840B894D03980520552B3EF39A/6045](http://note.youdao.com/yws/public/resource/c0ad463e177be9880ecc3b0293558130/xmlnote/AB403D840B894D03980520552B3EF39A/6045)

# 安装

```bash
$ npm install foxman -g
```

# 用法

**Step 1**: 创建config文件在你的当前目录，如: config.js，你可以使用 `foxman -c config.js` 来选中配置，如果未进行设置, 会在所在目录查找 `foxman.config.js` 并作为配置文件

格式如下：

```js
'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const routers = [
    {method: 'GET', url: '/index.html', sync: true, filePath: 'page/list'},
    {method: 'GET', url: '/index2.html', sync: false, filePath: 'index'},
    {method: 'GET', url: '/home/:id', sync: true, filePath: 'page/list'},
    {method: 'GET', url: '/wxConfig.html', sync: true, filePath: 'page/wxConfig'}
];
let r = path.resolve;
let alias = {
    r: r(__dirname, 'src', 'main', 'webapp')
};

module.exports = {
    /**
     * 如有需要，填写nei 的kei 然后执行 foxman -u 初始化工程目录。
     * nei: {
     *  key: '${nei key}'
     * },
     **/

    /**
     * task集合(基于gulp文件处理，故所有gulp插件都可用)
     * test -- String or Array<String> 需要进行转换的文件规则
     * handler -- Function 类型，需返回一个数组
     */
    preCompilers: [
        {
            test: [r(alias.r, 'src/mcss/**/*.mcss')],
            handler: (dest) => [
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
        host: 'm.kaola.com',
        service: {
            /**
             *
             * @param url -- request.url （http://m.kaola.com/(index.html?hello=world)）
             * @returns 完整的请求路径
             */
            test(url){
                let devMark = 'isDev=1000';
                let result = (-1 === url.indexOf('?') ? `?${devMark}` : `&${devMark}`);
                return 'http://m.kaola.com/' + url.replace(/^\//, '') + result;
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

**Step 2**: run `foxman`

```bash
$ foxman
```

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
