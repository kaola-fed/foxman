import staticCache from 'koa-static-cache';
import path from 'path';

export default ({app, statics}) => {
    const getStaticOption = ({
            dir,
            prefix,
            gzip = true,
            preload = true,
            dynamic = true,
            filter = file => file.indexOf('node_modules') === -1
        } = {}) => {

        return {
            dir,
            prefix: prefix ? prefix : ('/' + path.parse(dir).base),
            gzip,
            preload,
            dynamic,
            filter
        };
    };

    statics.forEach(item => {
        const dir = path.resolve(process.cwd(), item);
        app.use(staticCache(
            getStaticOption({dir})
        ));
    });

    app.use(staticCache(
        getStaticOption({
            dir: path.resolve(__dirname, 'client'),
            prefix: '/__FOXMAN__CLIENT__',
            dynamic: false
        })
    ));
};