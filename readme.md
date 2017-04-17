<div align="center">
  <h1>Foxman</h1>
  <p>
  <strong>Fox</strong>狐狸会说谎，有 Mock 之意；
  <strong>Man</strong> 优雅知性。
  </p>

  <a href="https://www.npmjs.com/package/foxman">
    <img src="https://img.shields.io/npm/v/foxman.svg?style=flat-square" alt="NPM version">
  </a>
  <a href="https://travis-ci.org/kaola-fed/foxman">
    <img src="https://img.shields.io/travis/kaola-fed/foxman.svg?style=flat-square" alt="build">
  </a>
  <a href="https://codecov.io/gh/kaola-fed/foxman">
    <img src="https://img.shields.io/codecov/c/github/kaola-fed/foxman.svg?style=flat-square" alt="build">
  </a>
  <a href="https://www.npmjs.com/package/foxman">
    <img src="https://img.shields.io/npm/dm/foxman.svg?style=flat-square" alt="download">
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/node/v/foxman.svg?style=flat-square" alt="node">
  </a>
  <a href="https://github.com/kaola-fed/foxman/blob/master/CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square" alt="Code of Conduct">
  </a>
  <a href="https://github.com/kaola-fed/foxman/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/kaola-fed/foxman.svg?style=flat-square" alt="license">
  </a>
</div>

## Foxman 有什么？

👀 **Mock Server**， 支持自定义模板引擎

🤘 **Living Reload**， 更灵活的 reload 机制

📡 **Remote Debugging**， 远程调试，取本地的模板与远程端的数据，方便联调

🚀 **Runtime Processor**， 运行时的即时编译，任何实现 foxman-processor 接口的处理器都能被装载进来

🐞 **Debuger**，集成 vconsole，方便移动端调试

💯 **NEI support**，集成网易接口维护利器 NEI，接口定义规范化

🤔 **Extensible**，强大的扩展方式，方便开发者自行定制所需功能

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

#### 1. 安装

```bash
# with npm
$ npm i -g foxman
# or with yarn
$ yarn global add foxman
```

⚠️ 6.4.0 以下版本 Node.js ，不在 Foxman 的版本支持列表里。建议尽可能尝试 latest 版本，促成主流版本进步


#### 2. 配置

[编写一份贴合工程情况的 Foxman 配置](https://foxman.js.org/#/configuration)

#### 3. 启动

```bash
$ foxman
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/10825163?v=3" width="80px;"/><br /><sub>君羽</sub>](https://github.com/imhype)<br />[💻](https://github.com/kaola-fed/foxman/commits?author=ImHype) 🔌 🚇 [📖](https://github.com/kaola-fed/foxman/commits?author=ImHype) [⚠️](https://github.com/kaola-fed/foxman/commits?author=ImHype)<br /> [🐛](https://github.com/kaola-fed/foxman/issues?q=author%3AImHype) 💡 | [<img src="https://avatars3.githubusercontent.com/u/9125255?v=3" width="80px;"/><br /><sub>MO</sub>](https://github.com/fengzilong)<br />[💻](https://github.com/kaola-fed/foxman/commits?author=fengzilong) [📖](https://github.com/kaola-fed/foxman/commits?author=fengzilong) 🚇 🔌<br /> [⚠️](https://github.com/kaola-fed/foxman/commits?author=fengzilong) |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## LICENSE

MIT
