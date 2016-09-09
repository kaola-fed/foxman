import EventEmitter from 'events';
import {
    resolve
} from 'path';
import {
    Event,
    util
} from '../../helper';
import chokidar from 'chokidar';
import anymatch from 'anymatch';

let watcher;
class Watcher {
    constructor(...args) {
        this.root = args[0];
        this.watcher = chokidar.watch(this.root, {
            ignored: /node_modules/,
            persistent: true
        });
        // this.watcher.setMaxListeners(0);
    }
    removeWatch(files) {
        this.watcher.unwatch(files);
    }
    onChange(...args) {
        args[0] = (Array.isArray(args[0])) ? (args[0].map((path) => {
            return resolve(this.root, path);
        })) : resolve(this.root, args[0]);

        let matcher = anymatch(args[0]);
        this.watcher.on('all', (event, path) => {
            if (['add', 'change', 'unlink'].indexOf(event) && matcher(path)) {
                args[1](path);
            }
        });
    }
}
export default function(...args) {
    if (!watcher) watcher = new Watcher(...args);
    return watcher;
};
