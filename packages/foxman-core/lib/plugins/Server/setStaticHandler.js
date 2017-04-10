const staticCache = require( 'koa-static-cache' );
const path = require( 'path' );
const formatStaticOptions = require( './utils/formatStaticOptions' );

module.exports = ({app, statics}) => {
    statics.forEach(options => {
        app.use(staticCache(options));
    });

    app.use(staticCache(formatStaticOptions({
        dir: path.resolve(__dirname, 'client'),
        prefix: '/__FOXMAN__CLIENT__',
        maxAge: 31536000
    })));
};
