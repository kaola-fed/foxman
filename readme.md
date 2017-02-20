# Foxman

[][nodei-url]
[![NPM version][npm-image]][npm-url]
[![download][downloads-image]][downloads-url]  
## Foxman 是什么？
Foxman 是面向**前端开发**的**集成工具**，对开发阶段的 Mock 环境、Css 预处理器、Living Reload、Remote Debugging、开发规范 等基本需要做了集成。

> Foxman 的理念源自组成他的两个词，"Fox" 与 "Man"。  
>  
> "Fox" -- 致力于打造一套让开发者难辨真伪的 Mock 支持；  
> "Man" -- 犹如绅士，优雅，希望给开发者带来更好的开发体验"。

```javascript
npm install --global foxman
```
**建议：安装最新版的 Node.js，促成社区共同进步**

## 文档
快速入门、配置、插件开发以及原理等文档 [docs/index.md](docs/index.md)

## 快速开始
1. [如何编写贴合工程开发情况的 Foxman 配置文件？](docs/foxman.md)
2. 启动 Foxman
```javascript
cd /path/to/my-project
foxman
```

3. 配置 NEI 之后，本地端与远程端数据同步，查看 [如何配置 NEI](docs/NEI.md)
```bash
foxman -u #update
```
4. 连接到后端主机|测试服务器，查看 [如何配置 Remote Debugging](docs/remoteDebugging.md)
```bash
foxman -p test #"test" 为在 config 中配置的远程服务器项
```

[npm-url]: https://www.npmjs.com/package/foxman
[npm-image]: https://img.shields.io/npm/v/foxman.svg
[downloads-image]: https://img.shields.io/npm/dm/foxman.svg
[downloads-url]: https://www.npmjs.com/package/foxman
[nodei-image]: https://nodei.co/npm/foxman.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://www.npmjs.com/package/foxman
