## 介绍

foxman的基础定位是一个mock server，但它的核心却是**为扩展而生**的

你会发现foxman的核心代码中找不到任何mock server相关的代码

mock server的能力是在foxman-core的插件体系之上拓展出来的一个能力，由几个内置插件共同组成

## 安装

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

### 运行环境

安装node和npm，详细过程参考官网 https://nodejs.org

<p class="warning">
foxman不支持v6.4.0以下的Node.js
</p>

### 安装

```bash
$ npm install -g foxman
```

## 配置样例

```js
module.exports = {
    port: 9000,
    secure: false,

    statics: [],
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
