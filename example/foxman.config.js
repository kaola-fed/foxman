'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const routers = require('./route');
let alias = {
    r: path.resolve(__dirname, 'src', 'main', 'webapp')
};
module.exports = {
    neiKey: '4af51152079f243c6dc28ce87908919e',
    preCompilers: [{
        test: [path.resolve(alias.r, 'src/mcss/**/*.mcss')],
        handler: (dest) => [
            mcss({
                "include": [],
                "exclude": "(\\\\|\\/)_",
                "format": 1
            }),
            autoprefix({
                browsers: ['Android >= 2.3'],
                cascade: false
            }),
            dest(path.resolve(alias.r, 'src/css'))
        ]
    }],
    watch:{
        root: alias.r
    },
    server: {
        routers,
        port: 5000,
        proxy: {
            test1: (url) => {
                let devMark = 'isDev=1000';
                let result = (-1 === url.indexOf('?') ? `?${devMark}` : `&${devMark}`);
                return 'http://10.240.178.181:90/' + url.replace(/^\//, '') + result;
            }
        },
        viewRoot: path.resolve(alias.r, 'WEB-INF'),
        syncData: path.resolve(__dirname, 'mock/fakeData'),
        asyncData: path.resolve(__dirname, 'mock/json'),
        static: [path.resolve(alias.r, 'src')]
    }
};
