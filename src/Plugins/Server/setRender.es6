import render from 'koa-ejs';
import path from 'path';

export function setRender ({Render, templatePaths, viewRoot}) {
    return new Render({
        templatePaths: templatePaths,
        viewRoot: viewRoot
    });
};

export function setView ({app}) {
    render(app, {
        root: path.resolve(__dirname, '../../../views'),
        layout: 'template',
        viewExt: 'html',
        cache: process.env.NODE_ENV !== 'development',
        debug: true
    });
}