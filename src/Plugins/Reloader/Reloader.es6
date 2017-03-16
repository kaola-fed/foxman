import EventEmitter from 'events';
import path from 'path';
import {values} from '../../helper/util';

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
        const reduceTemplateDir = (templateDir) => {
            return path.join(templateDir, '**', '*.' + server.extension)
        };
        const [server, watcher] = [this.server, this.watcher];
        const templatePathes = [...values(server.templatePaths), server.viewRoot].map(reduceTemplateDir);
        const syncDataRoot = path.join(server.syncData, '**', '*.json');
        const statics = server.static.reduce((prev, item) => {
            return [
                ...prev,
                ...['*.css', '*.js', '*.html'].map(ext => path.join(item, '**', ext))
            ];
        }, []);

        const reloadResources = [
            ...templatePathes,
            syncDataRoot,
            ...statics
        ];

        watcher.onUpdate(reloadResources, arg0 => {
            this.reload(path.basename(arg0));
        });
    }
}
export default Reloader;
