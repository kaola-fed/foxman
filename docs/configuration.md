## 配置项

### port

Type: `Number` `String`

foxman运行的端口

### secure

Type: `Boolean`

是否启用https

### statics

Type: `Array`

```js
[
    {
        dir: './src/', // 本地路径
        prefix: '/hello/', // 访问路径前缀 
        maxAge: 365 * 24 * 60 * 60, // 可选，过期时间
    }
]
```

或者

```js
[
    './src/' // 使用 /src/xxx 进行访问
]
```

静态目录，你可以使用prefix对静态目录进行url rewrite

### routes

Type: `Array`

自定义路由

```js
[
    {
        method: 'GET',  // GET | POST ...
        url: '/ajax/index.html', // 访问的路径
        sync: false, // 是否是页面接口
        filePath: 'foo.bar' // Mock 数据地址，或 ftl 地址，不带后缀
    },
]
```

建议使用 nei 或 [smartmount](../packages/foxman-plugin-smartmount) 代替 routes 模块

### viewRoot

Type: `String`

模板根路径

### extension

Type: `String`

Example: `ftl`

模板文件的后缀

### engine
Type: `Class`
除了 freemarker 以外，你也可以自己实现一个engine类，只要实现parse方法即可

```js
class Engine {
    constructor( viewRoot, engineConfig ) {}
    parse( filepath, data ) {}
}

module.exports = Engine;
```
实现细节，参考 [foxman-engine-freemarker](https://github.com/kaola-fed/foxman/tree/master/packages/foxman-engine-freemarker)。

然后，配置 foxman config 中的 engine 字段
```js
const Arttemplate = require('@foxman/engine-arttemplate');

...
engine: Arttemplate
...

```

以上操作即可实现自定义模板渲染引擎

已有的官方渲染引擎：
* @foxman/engine-arttemplate
* 

### engineConfig

Type: `Object`

engineConfig会作为额外参数传递给渲染引擎，即上文中的 `engineConfig` 字段

* **parse** 接收 filepath 和 data，返回一个 Promise

### syncData

Type: `String`

同步数据根路径

### asyncData

Type: `String`

异步数据根路径

### proxy

Type: `Array`

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

Foxman 的 proxy 功能会在请求中带上 `X-Special-Proxy-Header: Foxman` 的请求头

### plugins

Type: `Array`

foxman插件，已有的官方插件

### processors

Type: `Array`

```js
{ match: '/src/css/*.css', pipeline: [], locate( reqUrl ) {} }
```

- match: 匹配请求路径，如果路径匹配，则会进入pipeline
- pipeline: 对请求路径的一系列处理和文件定位，会通过请求找到源文件，然后进行一些诸如编译之类的操作，pipeline中会放一些foxman processors
- locate: 根据请求地址定位本地文件路径

根据请求动态编译文件内容并响应，比如stylus等的预编译

### nei

> NEI 是网易推出的一款接口定义平台

```js
nei: {
    key: "xxxxx"
}
```

将工程的 nei key 填入即可

<p class="warning">
注意：需要在nei中配置工程规范
</p>

**拉取nei数据**
```bash
$ foxman -U
```

**细节**

1. 首次 `foxman -U` 会在 ~/localMock 下创建一个名字为 nei key 的文件夹;
2. foxman响应异步请求时，会先读取localMock目录下的数据，再和工程内的 Mock Data 进行merge，最终进行响应

```javascript
Mock = Object.assign(localMock, projectMock)
```

<p class="tip">
虽然 foxman 提供了 Mock 数据两端的支持，但建议每次更新Mock数据永远只更新固定一处（本地 or nei）
</p>
