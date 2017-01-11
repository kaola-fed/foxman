import EventEmitter from 'events';
import path from 'path';

class Reloader extends EventEmitter {
    constructor(options) {
        super();
        Object.assign(this, options);
        this.bindChange();

        this.reload = (url) => {
            this.server.wss.broadcast(url);
        };
    }

    bindChange() {
        const [server, watcher] = [this.server, this.watcher];
        let reloadResources;
        reloadResources = [
            path.resolve(server.viewRoot, '**', '*.' + server.extension),
            path.resolve(server.syncData, '**', '*.json')
        ];

        server.static.forEach(item => {
            reloadResources = [...reloadResources,
                path.resolve(item, '**', '*.css'),
                path.resolve(item, '**', '*.js'),
                path.resolve(item, '**', '*.html')
            ];
        });

        watcher.onUpdate(reloadResources, (arg0) => {
            this.reload(path.basename(arg0));
        });
    }
}
export default Reloader;
