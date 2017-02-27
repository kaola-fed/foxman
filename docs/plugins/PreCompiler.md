## 如何配置现有的 Foxman PreCompiler
> PreCompiler 是指 Foxman 中的预处理器，如 css 预处理器；  

config.preCompilers 接受一个数组，数组中每一项是一个 PreCompiler 模型

PreCompiler 模型：
### test@Array<String>(必须)
> 匹配该规则的文件会进行 handler 描述的编译操作

**注意：test 文件匹配规则符合 glob 的文件匹配标准**

### handler@function
> 基于 Gulp 的 pipe 操作，该预处理器，会经过 Foxman-Mcss 处理后输出
```
handler: function (dest) {
    return [
        mcss({}),
        dest(resolve(__dirname, 'src/css/'))
    ]
}
```

## 如何编写一个 Foxman PreCompiler
> 由于文件处理的模块使用的是 [vinyl-fs](https://github.com/gulpjs/vinyl-fs) ，故所有的 Gulp Plugin 都能够改写成 Foxman 的 PreCompiler

你需要阅读，[如何编写一个gulp插件](http://www.cnblogs.com/giggle/archive/2017/02/06/6344789.html)。

或者你可以找到已有的 Gulp Plugin，如 gulp-mcss | gulp-sass | gulp-less 进行改写。

改写 Foxman PreCompiler 的方法是：在实际的预处理器处理之后，emit 一个 "returnDeps" 的事件，传递出特定的对象

```javascript
program.emit('returnDeps', {
    source: '/path/to/css.mcss', // 当前文件绝对路径
    deps: [] // 该文件的依赖
});
```

具体细节参考 [Foxman-Mcss](https://github.com/foxman-plugins/Mcss/blob/master/index.js#L50)