# Foxman

[][nodei-url]
[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]
[![build][travis-image]][travis-url]  

## Foxman 有什么？

👀 Mock Server， 支持自定义模板引擎

🤘 Living Reload， 更灵活的 reload 机制

📡 Remote Debugging， 远程调试，取本地的模板与远程端的数据，方便联调

🚀 Runtime Compiler， 运行时的即时编译，任何实现 Foxman-Processor 接口的处理器都能被装载进来

🐞 Debuger，集成 vconsole，方便移动端调试

💯 NEI supported，集成网易接口维护利器 NEI，接口定义规范化

🤔 Extensible，强大的扩展方式，方便开发者自行定制所需功能

最后一点个人认为很重要，每个工程都会有一些特殊性。而 Foxman 更像一个容器，提供必要的支持，又能方便开发者进行实际工程的特殊定制。

## Foxman 是什么？
曾经想过很多这个问题的回答，比如：
* Foxman 是 Mock Server，却又不只是 Mock Server（观众表示云里雾里）；
* Foxman 是前端开发的集成工具（经常会觉得这个描述很 low）；
* 一个小而美的前端开发环境（这个描述还不错）。

如今，我相信有了一个更好的：
* Foxman 本质上讲是一个以 Mock Server 为核心的容器，开发者可以基于内置的模块方便的添加扩展模块。所以，允许我称他为 Extensible Mock Server。

而设计 Foxman 的初衷体现在两个词根：
* **Fox** 狐狸会说谎，有 Mock 之意；
* **Man** 优雅知性。

## 文档
快速入门、配置、插件开发以及原理等[文档](https://foxman.js.org/#/get-started)

## 快速开始
#### 1. 安装到全局
```bash
$ npm install --global foxman
```

**注意：6.4.0 以下版本 Node.js ，不在 Foxman 的版本支持列表里。建议个人使用尽可能尝试 latest 版本，促成主流版本进步**


#### 2. [编写一份贴合工程情况的 Foxman 配置](https://foxman.js.org/#/configuration)
#### 3. 启动 Foxman
```bash
$ cd /path/to/my-project
$ foxman
```
## LICENSE
[![license][license-image]][license-url]

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
[license-url]: https://github.com/kaola-fed/foxman/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/kaola-fed/foxman.svg
[travis-image]: https://travis-ci.org/kaola-fed/foxman.svg?branch=master
[travis-url]: https://travis-ci.org/kaola-fed/foxman
