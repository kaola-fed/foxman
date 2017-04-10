const render = require( 'koa-ejs' );
const path = require( 'path' );

module.exports = { setRender, setView };

function setRender ({Render, templatePaths, viewRoot}) {
    return new Render({
        templatePaths: templatePaths,
        viewRoot: viewRoot
    });
}

function setView ({app}) {
    render(app, {
        root: path.resolve(__dirname, 'views'),
        layout: 'template',
        viewExt: 'html',
        cache: process.env.NODE_ENV !== 'development',
        debug: true
    });
}
