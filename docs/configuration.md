## 配置项

### Server

#### 静态资源

TODO

#### Mock

TODO

#### 渲染引擎

> 所有的渲染操作可以抽象成 View = Render(Template, Model)，前后端分离，Mock 开发 和 Proxy 得以实现，也是因为这个函数

foxman 的页面渲染 被抽象成了一个接口，只要符合以下方式书写，就能被 foxman 成功调用

```javascript
class Render {
    /**
     * @param  {} {viewRoot}
     */
    constructor({viewRoot}) {

    }
    /**
     * @param  String absPath
     * @param  Object data
     * @returns Promise
     */
    parse(absPath, data) {
    }
}
export default RenderUtil;
```

按这个接口实现的 Render 就能被 foxman 成功调用，参考 [render.es6](https://github.com/kaola-fed/foxman/blob/master/src/helper/render.es6)。

* **constructor** 在程序运行时，会被传入关键字段 viewRoot: config.viewRoot,  

* **parse** 接受 absPath 与 data，要求输出一个 Promise 并进行合法的 resolve 与 reject

### 处理器

> Processor 在 foxman 中是 Runtime Compiler 的角色，即前端 DSL 的即时处理，原理上可以整合任何 DSL 处理器。

config.processors 接受一个数组，数组中每一项是一个 Processor 模型

Processor 模型：  
基于 path-to-regexp 的 URL Mapping，对匹配到的请求，与 base 进行拼合后，进行 toSource 的操作，获取源文件位置，如果 Processor 自身存在 toSource 方法，也会倒序的进行 toSource 的操作，最终获得源文件位置，并执行编译操作。

比如这个例子，Processor 会做两件事情

1. 找到源码：
    1. URL Mapping 匹配 url 是否符合 Processor 的 publicPath;
    2. (base + url) => path;
    3. Processor.toSource(path) => src【修改位置从 dist 到 src 位置】;
    4. pipeline[0].toSource(src) => sourceFile【更改后缀】;
    5. 获得最终位置。
2. 编译过程：
    1. 获得源码 raw;
    2. autoPrefixer(mcss(raw))

```js
processors: [
    {
        base: paths.webapp,
        publicPath: '/src/css/**.css',
        pipeline: [
            new Mcss({
                "pathes": [
                    paths.components
                ],
                "format": 1
            }),
            new AutoPrefixer({
                browsers: ['Android >= 2.3'],
                cascade: false,
                remove: false
            })
        ],
        toSource: function (raw)  {
            return raw.replace(/\/css\//g, '/mcss/');
        }
    }
],
```

**如何编写一个 Processor**

一个合法 foxman 的 Processor 的基础方法有 constructor、toSource、handler，我们可以查看 foxman-processor-mcss 的源码有个大致的认识

```javascript
const mcss = require('mcss');

class Mcss {
    constructor({
        pathes = [],
        format = 1,
        sourcemap = false,
        indent = '    '
    }) {
        this.options = {
            pathes, format, sourcemap, indent
        };
    }

    toSource (raw) {
        return raw.replace(/\.css$/g, '\.mcss');
    }

    handler ({
        raw, filename,
        resolve, reject, updateDependencies
    }) {
        const options = Object.assign({}, this.options);
        const instance = mcss(options);
        instance.set('filename', filename);
        instance.translate(raw)
            .done(resolve)
            .fail(reject)
            .always(function () {
                updateDependencies(Mcss.getDependencies(instance));
            });
    }

    static getDependencies(instance) {
        return Object.keys(instance.get('imports'));
    }
}

exports = module.exports = Mcss
```

1. **constructor**  初始化自身需要的属性

2. **toSource** 从 targetPath 到 sourcePath 的函数操作

    ```javascript
    src = toSource(target);
    ```

3. **handler** foxman 会通过解构的方式传递给 Processor 5个对象，用于 Processor 的处理操作

    * raw, 未加工的文件内容
    * filename, 文件的处理到当前这个阶段他的名字
    * resolve, resolve(raw) 表示编译通过
    * reject, reject(raw) 表示编译失败，后续的编译操作也不会执行
    * updateDependencies，updateDependencies([]) 表示更新依赖

### 自动刷新

1. 会导致整个页面 reload 的代码更新

 - 模板文件更新
 - js文件更新
 - 同步 Mock 数据更新

2. 只导致该文件 reload 的代码更新

 - css文件更新

3. 不会导致页面 reload 的代码更新

 - 异步 Mock 数据更新


<p class="tip">
页面开发建议：先开发 html 代码，后书写 css 代码，再书写 js 代码
</p>

### Proxy

#### host@String(必需项)

> 用以发送给测试环境时带在 request 头上，给 nginx 分发用

#### service@object(必需项)
> service 的作用是接收到当浏览器的同步请求时，如何转发到远端 JSON url 上

```js
service: {
    local: function (url) {
        return 'http://127.0.0.1:8080/' + url;
    }
    test: function (url) {
        return 'http://10.165.125.195/' + url;
    }
}
```

**启动**
```bash
$ foxman -P test #"test" 为在 config 中配置的远程服务器项
```

**Proxy 实现原理**

foxman 在处理到同步请求时，会将请求根据 service 中规则转发，并在 Request Header 带上 'X-Special-Proxy-Header': 'foxman' 字段。

**Server 端如何实现**
拦截请求的 'X-Special-Proxy-Header' 字段，如果为 'foxman' 则将 页面 Model (MVC中的M)转成 JSON 后直接返回。

### NEI

> NEI 是网易推出的一款接口定义平台

#### nei@object(可选)

```javascript
nei: {
    key: "xxxxx"
}
```
将工程的 nei key 填写到 config.nei.key 中即可

<p class="warning">
注意：需要在nei中配置工程规范
</p>

**同步**
```bash
$ foxman -U
```

**运行细节**
1. 首次 `foxman -U` 会在 ~/localMock 下创建一个名字为 nei key 的文件夹;
2. Mock Server 响应时，会先读取该目录下的数据作为 Mock Data，再将工程内的 Mock Data 覆盖上来

```javascript
Mock = Object.assign(localMock, projectMock)
```

<p class="tip">
虽然 foxman 提供了 Mock 数据两端的支持，但建议每次更新Mock数据永远只更新固定一处（本地 or 远程端）
</p>

### 插件

[插件列表](/plugins)

## 基础配置

**第一步、在你的工程路径下创建 foxman.config.js，并添加以下基础内容**

```javascript
const path = require('path');
module.exports = {
    server: {
        routers: [{
              method: 'GET',
              url: '/foo.html',
              sync: true,
              filepath: 'foo.ftl' // 当前路径 ./template/ 文件夹下添加
          }, {
               method: 'POST',
               url: '/bar.html',
               sync: false,
               filepath: 'bar.json'
           }
        ],
        port: 9999,
        viewRoot: path.resolve(__dirname, 'template'), // 模板根路径
        syncData: path.resolve(__dirname, 'mock/sync/'), // 同步数据根路径
        asyncData: path.resolve(__dirname, 'mock/async'), // 异步数据根路径
        static: [
            path.resolve(__dirname, './src') // 静态资源根路径
        ]
    }
};
```
**第二步、创建第一个例子**

```bash
$ cd /path/to/your/project
```

创建 `./template/foo.ftl`

```html
Hello ${foo!"foxman"}
```

创建 `./mock/sync/foo.json`

```json
{
  "foo": "bar"
}
```

创建 `./mock/async/bar.json`

```json
{
  "bar": "foo"
}
```

**第三步、启动**

```bash
$ foxman
```
