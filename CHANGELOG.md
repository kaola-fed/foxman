## [v0.8.0](https://github.com/kaola-fed/foxman/releases/tag/58899e8) (2017-4-7)

这个版本, 新增了以下新特性：

- 重构了Precompiler 部分，调整成了即时编译的机制 [#94](https://github.com/kaola-fed/foxman/issues/94)
- freemarker 解析器更换为 Fast-FTL [#82](https://github.com/kaola-fed/foxman/issues/82)
- 日志工具统一更换为 chalklog [#89](https://github.com/kaola-fed/foxman/issues/89)
- 加入了 node-notifier 用于一些必要的提醒 [#87](https://github.com/kaola-fed/foxman/issues/87)

以下配置项或数据结构有所调整：

- 废除 preCompilers 字段，新增 processors [#94](https://github.com/kaola-fed/foxman/issues/94)
- server.routers需要命名空间，而非一概 concat [#93](https://github.com/kaola-fed/foxman/issues/93)
- server.static 允许传入对象，可用于缓存设置，该对象结构如下 [#98](https://github.com/kaola-fed/foxman/issues/98)
