const path = require('path');
const {values} = require('@foxman/helpers/lib/util');

class Reloader {
    constructor({server, watcher}) {
        this.server = server;
        this.watcher = watcher;
        this.watch();
    }

    notifyReload(url) {
        if (this.server && this.server.wss) {
            this.server.wss.broadcast({
                type: 'livereload',
                payload: url
            });
        }
    }

    watch() {
        const {server, watcher} = this;
        const {
            extension,
            viewRoot,
            templatePaths,
            syncData,
            statics
        } = server.serverOptions;

        const reduceTemplateDir = ({templatePath, extension}) => {
            return path.join(templatePath, '**', '*.' + extension);
        };

        const templates = [
            ...values(templatePaths),
            viewRoot
        ].map(templatePath =>
            reduceTemplateDir({
                templatePath,
                extension
            }));

        const syncDataRoot = path.join(syncData, '**', '*.json');
        const resources = statics.reduce(
            (total, current) => {
                return [
                    ...total,
                    ...['*.css', '*.js', '*.html'].map(tail =>
                        path.join(current.dir, '**', tail))
                ];
            },
            []
        );

        watcher.onUpdate([...templates, syncDataRoot, ...resources], filepath =>
            this.notifyReload(path.basename(filepath)));
    }
}
module.exports = Reloader;
