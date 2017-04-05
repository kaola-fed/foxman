## 如何配置现有的 Processor
> Processor 在 Foxman 中是 Runtime Compiler 的角色，即前端 DSL 的即时处理，原理上可以整合任何 DSL 处理器。

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

```
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

## 如何编写一个 Processor
一个合法 Foxman 的 Processor 的基础方法有 constructor、toSource、handler，我们可以查看 foxman-processor-mcss 的源码有个大致的认识

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
3. **handler** Foxman 会通过解构的方式传递给 Processor 5个对象，用于 Processor 的处理操作
    * raw, 未加工的文件内容
    * filename, 文件的处理到当前这个阶段他的名字
    * resolve, resolve(raw) 表示编译通过 
    * reject, reject(raw) 表示编译失败，后续的编译操作也不会执行
    * updateDependencies，updateDependencies([]) 表示更新依赖

        