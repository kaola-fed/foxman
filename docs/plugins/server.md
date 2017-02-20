## Server 配置 

### viewRoot@String (必需) 
> 模板根路径 (绝对路径)

### syncData@String (必需) 
> 同步 Mock 数据根路径 (绝对路径)

### asyncData@String (必需) 
> 异步 Mock 数据根路径 (绝对路径)

### routers@Array<Router> (必需) 
> routers 是一个数组，数组中每一项是一个 router。    

一个合法的 router 字段需要以下字段：
- method@String "GET" | "POST" | "DELETE" | "PUT"
- url@String 期望被访问的接口地址
- sync@Boolean 是否为同步接口
- filePath@String (相对路径) 同步接口相对 server.syncData ，异步接口相对 server.asyncData

### port@String (必需)
> 端口

### static@Array<String> (必需)
例：  
如果希望 `http://127.0.0.1/src/` 被访问到，则添加 src 的绝对路径到 static 数组中

### divideMethod@Boolean (可选) 
> 严格模式：是否只响应 满足 router 指定的方法请求

### debugTool@Boolean (可选)
> 移动端调试模式：是否启用 [vConsole](https://github.com/vConsole)

### extension@String (可选) 
> 模板文件扩展名，默认'ftl'，更改渲染引擎时换成你需要的扩展名

### RenderUtil@Render (可选)
RenderUtil是一个类，需要实现 [Render](./TemplateRender.md) 接口的 `parse` 方法

**注： 如需更换渲染引擎，需要同时修改 server.extension 与 server.RenderUtil**