const path = require('path');
const { values } = require('@foxman/helpers/lib/util');

class Reloader {
    constructor({ broadcast, watch, serverOptions }) {
        this.broadcast = broadcast;
        this.watch = watch;
        this.serverOptions = serverOptions;
        this._watch();
    }

    notifyReload(url) {
        this.broadcast({
            type: 'livereload',
            payload: url
        });
    }

    _watch() {
        const {
            extension,
            viewRoot,
            templatePaths,
            syncData,
            statics
        } = this.serverOptions;

        const reduceTemplateDir = ({ templatePath, extension }) => {
            return path.join(templatePath, '**', '*.' + extension);
        };

        const templates = [
            ...values(templatePaths),
            viewRoot
        ].map(templatePath =>
            reduceTemplateDir({
                templatePath,
                extension
            })
        );

        const syncDataRoot = path.join(syncData, '**', '*.json');
        const resources = statics.reduce((total, current) => {
            return [
                ...total,
                ...['*.css', '*.js', '*.html'].map(tail =>
                    path.join(current.dir, '**', tail)
                )
            ];
        }, []);

        this.watch(
            'change',
            [...templates, syncDataRoot, ...resources],
            filepath => this.notifyReload(path.basename(filepath))
        );
    }
}
module.exports = Reloader;
