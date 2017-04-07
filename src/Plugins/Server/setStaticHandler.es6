import staticCache from 'koa-static-cache';
import path from 'path';
import formatStaticOptions from './utils/formatStaticOptions';

export default ({app, statics}) => {
    statics.forEach(options => {
        app.use(staticCache(options));
    });

    app.use(staticCache(formatStaticOptions({
        dir: path.resolve(__dirname, 'client'),
        prefix: '/__FOXMAN__CLIENT__'
    })));
};