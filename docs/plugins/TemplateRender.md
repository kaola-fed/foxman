## 渲染引擎

> 所有的渲染操作可以抽象成 View = Render(Template, Model)，前后端分离，Mock 开发 和 Proxy 得以实现，也是因为这个函数

Foxman 的页面渲染 被抽象成了一个接口，只要符合以下方式书写，就能被 Foxman 成功调用

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

按这个接口实现的 Render 就能被 Foxman 成功调用，参考 [render.es6](https://github.com/kaola-fed/foxman/blob/master/src/helper/render.es6)。

* **constructor** 在程序运行时，会被传入关键字段 viewRoot: config.viewRoot,  

* **parse** 接受 absPath 与 data，要求输出一个 Promise 并进行合法的 resolve 与 reject

