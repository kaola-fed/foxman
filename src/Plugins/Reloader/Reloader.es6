import EventEmitter from 'events';
import path from 'path';
import {values, log} from '../../helper/util';

class Reloader extends EventEmitter {
    constructor(options) {
        super();
        Object.assign(this, options);
        this.bindChange();
    }

    reload(url) {
        if (this.server && this.server.wss) {
            this.server.wss.broadcast(url);
        }
    }

    bindChange() {
        const {server, watcher} = this;
        const {
            extension, 
            viewRoot, templatePaths, syncData, statics} = server.serverOptions;

        const reduceTemplateDir = ({templatePath, extension}) => {
            return path.join(templatePath, '**', '*.' + extension);
        };

        const templatePathes = [...values(templatePaths), viewRoot]
            .map(templatePath => 
                reduceTemplateDir({
                    templatePath, extension
                }));

        const syncDataRoot = path.join(syncData, '**', '*.json');
        const resources = statics.reduce((prev, item) => {
            return [
                ...prev,
                ...['*.css', '*.js', '*.html'].map(ext => path.join(item.dir, '**', ext))
            ];
        }, []);

        const reloadResources = [
            ...templatePathes,
            syncDataRoot,
            ...resources
        ];

        watcher.onUpdate(reloadResources, arg0 => {
            this.reload(path.basename(arg0));
        });
    }
}
export default Reloader;
