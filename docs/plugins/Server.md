## Server 配置 

### viewRoot@String (必需) 
> 模板根路径 (绝对路径)

### templatePaths@Object (可选) 
> 支持 include 或 import 的 路径，取决于具体的 Render
注意： 这是一个对象，最终会被传入到 模板解析器，作为一个 alias 的行为，默认的 Fast-FTL 解析器会被用于 MultiTemplateLoader

### syncData@String (必需) 
> 同步 Mock 数据根路径 (绝对路径)

### asyncData@String (必需) 
> 异步 Mock 数据根路径 (绝对路径)

### routers@Array<Router> (必需) 
> routers 是一个数组，数组中每一项是一个 router。    

一个合法的 router 字段需要以下字段：
- method@String "GET" | "POST" | "DELETE" | "PUT" 在 server.divideMethod 为 true 时失效
- url@String 期望被访问的接口地址
- sync@Boolean 是否为同步接口
- filePath@String (相对路径) 同步接口相对 server.syncData ，异步接口相对 server.asyncData
- handler@Function 可执行函数，会把 server 运行时的这个请求的 context(koa context) 传入进来，要求返回一个 json 对象

### port@String (必需)
> 端口
同样支持命令行执行时的临时修改 
```bash
$ foxman -p 80
``` 

### static@Array<String> (必需)
例：  
如果希望 `http://127.0.0.1/src/` 被访问到，则添加 src 的绝对路径到 static 数组中

### divideMethod@Boolean (可选) 
> 严格模式：是否禁用 Router 的 method 字段，而匹配所有请求类型

### debugTool@Boolean (可选)
> 移动端调试模式：是否启用 [vConsole](https://github.com/vConsole)

### extension@String (可选) 
> 模板文件扩展名，默认'ftl'，更改渲染引擎时换成你需要的扩展名

### RenderUtil@Render (可选)
RenderUtil是一个类，需要实现 [Render](./TemplateRender.md) 接口的 `parse` 方法

**注： 如需更换渲染引擎，需要同时修改 server.extension 与 server.RenderUtil**