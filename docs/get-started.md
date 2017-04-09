# Get Started

## 介绍

### Foxman 是什么？
> Foxman 是面向**前端开发**的**集成工具**，对开发阶段的 Mock 环境、CSS 预处理器、Living Reload、Remote Debugging、开发规范 等基本需要做了集成。

而他的设计初衷体现在构成他的两个词根上:  
* Fox 狐狸会说谎，有 Mock 之意
* Man 优雅知性

## 安装

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

### 运行环境

安装 node 和 npm，详细过程参考官网 https://nodejs.org

<p class="warning">
node 版本要求 0.8.x，0.10.x, 0.12.x，4.x，6.x，不在此列表中的版本不予支持。最新版本 node 支持会第一时间跟进，支持后更新支持列表。
</p>

- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm

建议：安装最新版的 Node.js，促成社区共同进步

### 安装

```bash
$ npm install -g foxman
```

- `-g` 安装到全局目录，必须使用全局安装，当全局安装后才能在命令行（cmd或者终端）找到 `foxman` 命令
- 如果 npm 长时间运行无响应，推荐使用 [cnpm](http://npm.taobao.org/) 来安装

安装完成后执行 `foxman -v` 判断是否安装成功，如果安装成功，则显示类似如下信息：

```bash
$ foxman -v

v0.8.0
```

### 升级

```bash
$ npm install -g foxman
```

## 配置样例

```javascript
'use strict';
/****************** IMPORT START ******************/
const path = require('path');
const resolve = path.resolve;
/****************** IMPORT END ******************/


/****************** ROUTERS START ******************/
/**
 * @Router
 *  @Property method: 'POST',
 *  @Property url: '/foo',
 *  @Property sync: false,
 *  @Property filePath 'foo/bar'
 *  @type {Object}
 */
const Router = {
    method: 'POST',
    url: '/foo.html',
    sync: false,
    filepath: 'foo.json'
};
/**
 * @Routers
 * @type {Array<Router>}
 */
const Routers = [
    /** Router **/
];
/****************** ROUTERS END ******************/


/****************** PATHS START ******************/
const paths = (function () {
    const paths = {};

    Object.assign(paths, {
        webapp: resolve(__dirname, 'src', 'main', 'webapp')
    });

    Object.assign(paths, {
        viewRoot: resolve(paths.webapp, 'WEB-INF', 'tpl'),
        syncData: resolve(paths.webapp, 'mock', 'sync'),
        asyncData: resolve(paths.webapp, 'mock', 'async')
    });

    Object.assign(paths, {
        src: resolve(paths.webapp, 'source'),
        res: resolve(paths.webapp, 'res')
    });

    Object.assign(paths, {
        mcssSrc: resolve(paths.src, 'mcss/**/[^_]*.mcss'),
        components: resolve(paths.src, 'javascript/components'),
        mcssTarget: resolve(paths.src, 'css/')
    });

    return paths;
}());
/****************** PATHS END ******************/


/****************** COMMONURL START ******************/
const commonUrl = function (ip) {
    const address = [ 'http://', ip, '/'].join('');
    return (url) => (address + url);
};
/****************** COMMONURL END ******************/


module.exports = {
    nei: {
        key: 'xxxxxxxx'
    },
    plugins: [
        new (require('foxman-plugin-mock-control'))({
            mapJS: function (dataPath) {
                return (function (jsMockPath) {
                    /**
                     * If you can't find out ${jsMockPath}. You could open this comment.
                     * cosnole.log(jsMockPath);
                     */
                    return jsMockPath;
                }(dataPath.replace(/\.json/g, '.js')));
            }
        }),
        new (require('foxman-plugin-route-display'))()
    ],
    preCompilers: [
        {
            test: [paths.mcssSrc],
            handler: function (dest) {
                return [
                    require('foxman-mcss')({
                        "include": [paths.components],
                        "format": 1
                    }),
                    require('gulp-autoprefixer')({
                        browsers: ['Android >= 2.3'],
                        cascade: false,
                        remove: false
                    }),
                    dest(paths.mcssTarget)
                ];
            }
        }
    ],
    watch: {
        root: paths.webapp
    },
    proxy: {
        host: 'm.kaola.com',
        /**
         * Proxy Controller
         * @param url
         * @returns {string}
         * If You Want To add Proxy Service，Please Add A Function At service, And Run as `foxman -p ${proxy_name}`
         * Example： foxman -P hst_test10
         */
        service: {
            test (url) {
                return commonUrl('m.kaola.com')(url);
            }
        }
    },
    server: {
        routers: Routers,
        port: 9999,
        divideMethod: !!0,
        debugTool: !0,
        viewRoot: paths.viewRoot,
        syncData: paths.syncData,
        asyncData: paths.asyncData,
        static: [
            paths.src,
            paths.res,
        ]
    }
};
```

## 工作原理

TODO
