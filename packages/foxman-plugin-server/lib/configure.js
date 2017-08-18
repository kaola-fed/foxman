const render = require('koa-ejs');
const SDF = require('koa-sdf');
const path = require('path');

module.exports = { configureViewEngine, configureEjs, configureStatics };

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

function configureStatics({ app, statics }) {
    statics.forEach(options => {
        app.use(
            () => 
                SDF(options));
    });
}
