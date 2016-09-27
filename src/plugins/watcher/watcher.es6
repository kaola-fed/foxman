import {
    resolve
} from 'path';
import chokidar from 'chokidar';
import anymatch from 'anymatch';

let watcher;
class Watcher {
    constructor(...args) {
        let root = args[0] || process.cwd();
        let watcher = chokidar.watch(root, {
            ignored: ['**/.git/**', '**/node_modules/**', '**/.gitignore'],
            persistent: true
        });

        this.watching = {
            all: [], new: [], change: []
        };
        this.handlers = {
            all: [], new: [], change: []
        };

        /**
         * all change unlink
         */
        watcher.on('all', (event, path, stats) => {
            if (-1 == (['add', 'change', 'unlink'].indexOf(event))) return;
            this.update('all', event, path, stats);
        });

        /**
         * 改变
         */
        watcher.on('change', (path, stats) => {
            this.update('change', 'change', path, stats);
        });

        /**
         * new 
         */
        watcher.on('all', (event, path, stats) => {
            if (-1 == (['add', 'change'].indexOf(event))) return;
            this.update('new', event, path, stats);
        });
    }

    update(type, event, path, stats) {
        this.watching[type].forEach((pattern, idx) => {
            if (anymatch(pattern)(path)) {
                this.handlers[type][idx](path, event, stats);
            }
        });
    }

    removeWatch(watching, fn) {
    }

    onChange(files, handler) {
        this.watching['all'].push(files);
        this.handlers['all'].push(handler);
    }

    onUpdate(files, handler) {
        this.watching['change'].push(files);
        this.handlers['change'].push(handler);
    }

    onNew(files, handler) {
        this.watching['new'].push(files);
        this.handlers['new'].push(handler);
    }
}
export default function (...args) {
    if (!watcher) watcher = new Watcher(...args);
    return watcher;
};
