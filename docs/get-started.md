# Get Started

## 介绍

foxman的基础定位是一个mock server，但它的核心却是**为扩展而生**的

你可能想不到，它的核心代码中找不到任何mock server相关的代码

mock server的能力是在foxman-core的插件体系之上拓展出来的一个能力，mock server的功能由几个内置插件共同组成

所以说，foxman定位为一个可扩展的mock server，但它提供的绝不仅仅只是一个mock server，你可以基于foxman-core定制出自己想要的任何命令行工具

## 安装

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

### 运行环境

安装 node 和 npm，详细过程参考官网 https://nodejs.org

<p class="warning">
foxman 不支持v6.4.0以下的Node.js
</p>

- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm

建议：安装最新版的 Node.js，促成社区共同进步

### 安装

```bash
$ npm install -g foxman
```

## 配置样例

```js
module.exports = {
    port: 9000,
    secure: false,

    static: [],
    routes: [],

    // engine: 'freemarker',
    engineConfig: {},

    viewRoot: '',
    extension: 'ftl',
    syncData: '',
    asyncData: '',

    plugins: [],

    processors: [
        { match: '/src/css/*.css', pipeline: [], locate( reqUrl ) {} }
    ],

    proxy:  [
        { name: 'pre', host: 'm.kaola.com', ip: '1.1.1.1', protocol: 'http' }
    ]
}
```
