## PreCompiler
> PreCompiler 是指 Foxman 中的预处理器，如 css 预处理器  

> PreCompiler 调用的是 Gulp Plugin ，所以所有的 Gulp Plugin 都能够改写成 Foxman 的 PreCompiler


配置项是一个数组，数组每一项是独立的 **Compiler** (**Array<Compiler>**)  
以下 preCompiler 的数据结构  

字段名 | 作用 | 例子
---- | --- | ---
test | Array<path> 符合该规则会进行该编译操作 | [path.resolve(paths.webapp, 'src/mcss/**/*.mcss')]
ignore | Array<path> 符合该规则的会被忽略 | [path.resolve(paths.webapp, '**/_*.mcss')]
handler | function 类型，需要 return 一个数组，用以表示编译流| 如下

```
...略
handler: function (dest) {
    return [
        mcss({
            "include": [resolve(paths.webapp, 'src/javascript/components')],
            "format": 1
        }),
        dest(resolve(paths.webapp, 'src/css/'))
    ]
}
...略
```
**注：**  
1. 文件匹配部分使用 **glob** 的文件匹配标准  
2. foxman-mcss 支持的配置项和 mcss.json 中配置一致,不支持 exclude，使用 **igonre** 替代
