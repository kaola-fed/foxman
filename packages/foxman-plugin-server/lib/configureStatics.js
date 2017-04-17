const koaStatic = require('koa-sdf');
const path = require('path');
const formatStaticOptions = require('./utils/formatStaticOptions');

module.exports = ({ app, statics }) => {
    statics.forEach(options => {
        app.use(koaStatic(options));
    });

    app.use(
        koaStatic(
            formatStaticOptions({
                dir: path.resolve(__dirname, 'client'),
                prefix: '/__FOXMAN__CLIENT__',
                maxAge: 31536000
            })
        )
    );
};
