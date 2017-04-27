## 配置项

### Server

#### 静态资源

TODO

#### Mock

TODO

#### 渲染引擎

> 所有的渲染操作可以抽象成 View = Render(Template, Model)，前后端分离，Mock 开发 和 Proxy 得以实现，也是因为这个函数

渲染引擎 被抽象成了一个接口，只要符合以下方式书写，就能被 foxman 成功调用

```js
class RenderEngine {
    constructor( viewRoot, engineConfig ) {}
    parse( filepath, data ) {}
}
module.exports = RenderEngine;
```

按这个接口实现的 渲染引擎 就能被 foxman 成功调用，参考 [foxman-engine-freemarker](https://github.com/kaola-fed/foxman/tree/master/packages/foxman-engine-freemarker)。

* **constructor** 在程序运行时，会被传入关键字段 viewRoot 和 engineConfig,

* **parse** 接收 filepath 和 data，返回一个 Promise

### 处理器

config.processors 接受一个数组，数组中每一项是一个 Processor 模型

Processor 模型：  
基于 通配符 的 请求匹配，接收到一个请求后进行 locate 操作，定位源文件位置，如果 Processor 自身存在 locate 方法，会倒序执行 locate，最终找到源文件位置，并执行编译。

**如何编写一个 Processor**

一个合法 Processor类 应当实现locate、handler，我们可以查看 [foxman-processor-mcss](https://unpkg.com/foxman-processor-mcss@1.0.0-2/index.js) 的源码有个大致的认识

```javascript
const mcss = require('mcss');
const Logger  = require('chalklog');
const log = new Logger('processor-mcss');

class Mcss {
    constructor({
        pathes = [],
        format = 1,
        sourcemap = false,
        indent = '    '
    }) {
        pathes = pathes.filter(function (item, i) {
            if (!item) {
                log.red('new Mcss({pathes: []}) 鏃朵紶鍏ョ殑 pathes 鏁扮粍涓 ' + i + ' 椤逛负绌猴紝璇锋鏌�');
                process.exit(1);
            }
            return !!item;
        });
        this.options = {
            pathes, format, sourcemap, indent
        };
    }

    locate (raw) {
        return raw.replace(/\.css$/g, '\.mcss');
    }

    *handler ({ raw, filename }) {
        const options = Object.assign({}, this.options);
        const instance = mcss(options);
        instance.set('filename', filename);

        const result = yield new Promise((resolve, reject) => {
            instance.translate(raw)
                .done((text) => {
                    resolve({
                        content: text,
                        dependencies: Mcss.getDependencies(instance)
                    });
                })
                .fail(reject)
        })

        return result;
    }

    static getDependencies(instance) {
        return Object.keys(instance.get('imports'));
    }
}

module.exports = Mcss
```

1. **constructor**  初始化自身需要的属性

2. **locate** 从 targetPath 到 sourcePath 的函数操作

    ```javascript
    src = toSource(target);
    ```

3. **handler** 用于 Processor 的处理，本身是一个generator函数，接收如下参数

    * raw, 未加工的文件内容
    * filename, 文件的处理到当前这个阶段他的名字

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

> host会作为headers中的一项传递给后端，用于nginx分发

```js
proxy:  [
	{
		name: 'pre',
		host: 'm.kaola.com',
		ip: '1.1.1.1',
		protocol: 'http'
	}
]
```

**启动**

```bash
$ foxman -P pre
```

**Proxy 实现原理**

foxman 在处理到同步请求时，会将请求进行转发，并在 headers 中带上

```
'X-Special-Proxy-Header': 'foxman'
```

**改造服务端**

拦截请求的 'X-Special-Proxy-Header' 字段，如果为 'foxman' 则将 页面 Model (MVC中的M)转成 JSON 后直接返回。

### NEI

> NEI 是网易推出的一款接口定义平台

```javascript
nei: {
    key: "xxxxx"
}
```
将工程的 nei key 填写到 config.nei.key 中即可

<p class="warning">
注意：需要在nei中配置工程规范
</p>

**拉取nei数据**
```bash
$ foxman -U
```

**运行细节**

1. 首次 `foxman -U` 会在 ~/localMock 下创建一个名字为 nei key 的文件夹;
2. foxman响应异步请求时，会先读取localMock目录下的数据，再和工程内的 Mock Data 进行merge，最终进行响应

```javascript
Mock = Object.assign(localMock, projectMock)
```

<p class="tip">
虽然 foxman 提供了 Mock 数据两端的支持，但建议每次更新Mock数据永远只更新固定一处（本地 or nei）
</p>

### 插件

[插件列表](/plugins)

## 配置

参考：[example](https://github.com/kaola-fed/foxman/tree/master/example)
