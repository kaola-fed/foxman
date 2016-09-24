import {
    resolve
} from 'path';
import chokidar from 'chokidar';
import anymatch from 'anymatch';

let watcher;
class Watcher {
    constructor(...args) {
        this.root = args[0];
        this.watching = [];
        this.handlers = [];

        this.watcher = chokidar.watch(process.cwd(), {
            ignored: ['**/.git/**', '**/node_modules/**', '**/.gitignore'],
            persistent: true
        });

        this.watcher.on('all', (event, path) => {
            if (-1 == (['add', 'change', 'unlink'].indexOf(event))) {
                return;
            }
            this.watching.forEach((pattern, idx) => {
                if (anymatch(pattern)(path)) {
                    this.handlers[idx](path, event);
                }
            });
        });
    }
    removeWatch(watching, fn) {
        let fnIdx = this.handlers.indexOf(fn);
        let watchingIdx = this.watching.indexOf(watching);

        if (fnIdx == watchingIdx) {
            this.handlers.splice(fnIdx, 1);
            this.watching.splice(fnIdx, 1);
        }
    }
    onChange(files, handler) {
        this.watching.push(files);
        this.handlers.push(handler);
    }
}
export default function (...args) {
    if (!watcher) watcher = new Watcher(...args);
    return watcher;
};
