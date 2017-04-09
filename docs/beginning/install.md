## 安装

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

### 安装 Node 和 NPM

详细过程参考官网 https://nodejs.org

> Node.js **版本要求** 6.4.0 以下版本 Node.js ，不在 Foxman 的版本支持列表里。最新版本 Node.js 支持会第一时间跟进，支持后更新支持列表。

- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm

建议：建议个人使用尽可能尝试 latest 版本，促成主流版本进步

### 安装 Foxman

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

### 升级 Foxman

```bash
$ npm install -g foxman
```