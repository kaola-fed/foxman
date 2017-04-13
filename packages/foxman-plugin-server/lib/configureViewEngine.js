const render = require('koa-ejs');
const path = require('path');

module.exports = { configureViewEngine, configureEjs };

function configureViewEngine({ Render, templatePaths, viewRoot }) {
    return new Render({
        templatePaths: templatePaths,
        viewRoot: viewRoot
    });
}

function configureEjs({ app }) {
    render(app, {
        root: path.resolve(__dirname, 'views'),
        layout: 'template',
        viewExt: 'html',
        cache: process.env.NODE_ENV !== 'development',
        debug: true
    });
}
