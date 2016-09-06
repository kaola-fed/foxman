'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const mcss = require('mcss');
const replaceExt = require('replace-ext');
const PluginError = gutil.PluginError;
const foxmanApi = require('foxman-api')
const Event = foxmanApi.Event;

module.exports = function(opt) {
    let res;
    return ( res = through.obj((file, enc, cb) => {
        if (file.isNull())
            return cb(null, file);
        if (file.isStream())
            return cb(new PluginError('gulp_mcss', 'Streaming not supported'));

        const options = Object.assign({
            filename: file.path
        }, opt);

        try {
            let instance = mcss(options);
            instance.translate().done((text) => {
                file.contents = new Buffer(text);
                file.path = replaceExt(file.path, '.css');
                cb(null, file);
            }).fail((err) => {
                mcss.error.format(err);
                console.log(err.message);
                cb();
            }).always(() => {
                // console.log(instance.get('imports'));
                /**
                 * 得到当前mcss的依赖
                 * @type {[type]}
                 */
                let imports = Object.keys(instance.get('imports'));
                // console.log(imports);
                res.emit('returnDependencys', new Event(options.filename, imports));
                // console.log(dependencyMap[filepath]);
            });
        } catch (err) {
            cb(new PluginError('gulp_mcss', err));
        }
    }));

};
