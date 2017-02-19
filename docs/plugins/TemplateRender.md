## 渲染引擎

> Foxman 的同步页面渲染 被抽象成了一个接口，只要符合以下方式书写，就能被 Foxman 成功调用

```javascript
class RenderUtil {
    constructor({viewRoot}) {
        ...
    }
    /**
     * @arg p1 -- 绝对路径
     * @arg data -- MockData
     * @returns @Promise
     */
    parse(p1, data) {
        ...
    }
}
export default RenderUtil;
```