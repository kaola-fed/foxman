'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const mcss = require('mcss');
const replaceExt = require('replace-ext');
const PluginError = gutil.PluginError;

module.exports = function (opt) {
    return through.obj((file, enc, cb) => {
        if (file.isNull())
            return cb(null, file);
        if (file.isStream())
            return cb(new PluginError('gulp_mcss', 'Streaming not supported'));

        const options = Object.assign({
            filename: file.path
        }, opt);

        try {
            mcss(options).translate().done((text) => {
                file.contents = new Buffer(text);
                file.path = replaceExt(file.path, '.css');
                cb(null, file);
            }).fail((err) => {
                mcss.error.format(err);
                console.log(err.message);
                cb();
            });
        } catch (err) {
            cb(new PluginError('gulp_mcss', err));
        }
    });
};
