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
foxman 不支持v6.4.0以下的Node.js
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
$ npm remove -g foxman
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
