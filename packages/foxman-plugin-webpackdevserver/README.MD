## WebpackDevServer
> Foxman-Plugin

### 如何启用
1. cd path/to/project(以启用 foxman 的工程)
2. npm i --save-dev foxman-plugin-webpack-dev-server
3. 在 foxman.config.js 中新增 plugins 的配置项
```javascript
const WebpackDevServer = require('foxman-plugin-webpack-dev-server');
const webpackConfig = require('./webpack.config');
module.exports = {
    ...
    plugins: [
         new WebpackDevServer({
            webpackConfig,
            devServerConfig:{
                quiet: true,
                noInfo: true
            }
        })
    ],
    ...
}
```
### devServerConfig 默认配置项
```javascript
options.devServerConfig = {
    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: true,
    // switch into lazy mode
    // that means no watching, but recompilation on every request
    watchOptions: {
        aggregateTimeout: 300
    },
    // filename: "bundle.js",
    // delay after change (only lazy: false)
    // public path to bind the middleware to
    // use the same as in webpack

    headers: {"X-Custom-Header": "yes"},
    // custom headers

    stats: {
        colors: true
    },
    contentBase: webpackConfig.output.path,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    // stats: webpackConf.devServer.stats
    // options for formating the statistics
}
```
