/**
 * Created by june on 2017/1/14.
 */
'use strict';
const webpackMiddleware = require('koa-webpack-dev-middleware');
const WebpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpack = require('webpack');

const typeOf = (obj, type) => {
    return (
        Object.prototype.toString.call(obj).toLowerCase().slice(8, -1) == type
    );
};

const addDevModule = entry => {
    if (!typeOf(entry, 'array')) {
        entry = [entry];
    }
    entry.unshift('webpack/hot/dev-server');
    entry.unshift('webpack-hot-middleware/client?reload=true');
    return entry;
};

const reducePlugins = plugins => {
    if (!typeOf(plugins, 'array')) {
        plugins = [];
    }

    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
    return plugins;
};

const reduceEntry = entry => {
    if (typeOf(entry, 'object')) {
        for (let key in entry) {
            if (entry.hasOwnProperty(key))
                entry[key] = addDevModule(entry[key]);
        }
    } else if (typeOf(entry, 'array')) {
        entry = addDevModule(entry);
    } else if (typeOf(entry, 'string')) {
        entry = addDevModule(entry);
    }

    return entry;
};

const validateWebpackConfig = webpackConfig => {
    if (!typeOf(webpackConfig, 'object')) {
        throw new Error('webpackConfig must be object');
    }

    if (!typeOf(webpackConfig.output, 'object')) {
        throw new Error('webpackConfig.output must be object');
    }

    if (!typeOf(webpackConfig.output.path, 'string')) {
        throw new Error('webpackConfig.output.path must need');
    }

    if (!typeOf(webpackConfig.output.publicPath, 'string')) {
        throw new Error('webpackConfig.output.publicPath must need');
    }
};

const getDevServerConfig = (webpackConfig, devServerConfig) => {
    return Object.assign(
        {
            noInfo: false, // display no info to console (only warnings and errors)
            quiet: false, // display nothing to the console
            lazy: false, // switch into lazy mode // that means no watching, but recompilation on every request
            watchOptions: {
                aggregateTimeout: 300
            },
            headers: { 'X-Special-Static-Header': 'foxman' },
            stats: {
                colors: true
            },
            contentBase: webpackConfig.output.path,
            publicPath: webpackConfig.output.publicPath,
            hot: true
        },
        devServerConfig
    );
};

function WebpackDevServerPlugin({ webpackConfig, devServerConfig }) {
    validateWebpackConfig(webpackConfig);

    if (!typeOf(devServerConfig, 'object')) {
        devServerConfig = {};
    }
    webpackConfig.devServer = {
        inline: true
    };
    webpackConfig.plugins = reducePlugins(webpackConfig.plugins);
    webpackConfig.entry = reduceEntry(webpackConfig.entry);

    this.webpackConfig = webpackConfig;
    this.devServerConfig = getDevServerConfig(webpackConfig, devServerConfig);
}

WebpackDevServerPlugin.prototype.init = function({ service }) {
    const { webpackConfig, devServerConfig } = this;
    const compiler = webpack(webpackConfig);
    const use = service('server.use');
    use(() => {
        return webpackMiddleware(compiler, devServerConfig);
    });
    use(() => {
        return WebpackHotMiddleware(compiler);
    });
};

module.exports = WebpackDevServerPlugin;
