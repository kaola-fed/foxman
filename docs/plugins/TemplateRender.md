## 渲染引擎

> Foxman 的同步页面渲染 被抽象成了一个接口，只要符合以下方式书写，就能被 Foxman 成功调用

```javascript
class RenderUtil {
    /**
     * @param  {} {viewRoot}
     */
    constructor({viewRoot}) {
    
    }
    /**
     * @param  {} p1
     * @param  {} data
     * @returns Promise
     */
    parse(p1, data) {
    }
}
export default RenderUtil;
```

按这个接口实现的 Render 就能被 Foxman 成功调用，参考 [render.es6](https://github.com/kaola-fed/foxman/blob/master/src/helper/render.es6)。

### constructor
在程序运行时，会被传入：
* viewRoot foxman.config.js 中模板根路径

### parse
在程序运行时，会被传入：
* p1 访问的模板的绝对路径
* data JSON 格式的 Mock 数据

要求输出一个满足 Promise 接口的输出