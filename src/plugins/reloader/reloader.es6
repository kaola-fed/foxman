import EventEmitter from 'events';
import path from 'path';
import {util, fileUtil} from "../../helper";

class Reloader extends EventEmitter {
    constructor(options) {
        super();
        Object.assign(this, options);
        this.bindChange();
    }
    bindChange() {
        let [server, watcher] = [this.server, this.watcher];

        let reloadResources = [
            path.resolve(server.viewRoot, '**', '*.' + server.extension),
            path.resolve(server.syncData, '**', '*.json')
        ];
        
        let reload = util.throttle((arg0) => {
            server.wss.broadcast(path.basename(args[0]));
        }, 1000);

        server.static.forEach(item => {
            reloadResources.push(path.resolve(item, '**', '*.css'));
            reloadResources.push(path.resolve(item, '**', '*.js'));
            reloadResources.push(path.resolve(item, '**', '*.html'));
        });
        this.watcher.onUpdate(reloadResources, reload);
    }
}
export default Reloader;
