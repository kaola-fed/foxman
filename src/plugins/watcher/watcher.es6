import chokidar from 'chokidar';
import anymatch from 'anymatch';
import {removeByItem, removeByIndex} from '../../helper/util';
let watcher;
class Watcher {
	constructor(...args) {
		let root = args[0] || process.cwd();
		let watcher = chokidar.watch(root, {
			ignored: /(\.git)|(node_modules)|(\.gitignore)|(__temp__)/,
			ignoreInitial: true,
			interval: 300,
			binaryInterval: 300,
			ignorePermissionErrors: true
		});

		this.watching = {
			new: [],
			change: []
		};

		this.handlers = {
			new: [],
			change: []
		};

        /**
         * modify files
         */
		watcher.on('change', (path, stats) => {
			this.do('change', 'change', path, stats);
		});

        /**
         * create files
         */
		watcher.on('add', (path, stats) => {
			this.do('new', 'new', path, stats);
		});
	}

	do(type, event, path, stats) {
		this.watching[type].forEach((pattern, idx) => {
			if (pattern && anymatch(pattern)(path)) {
				this.handlers[type][idx](path, event, stats);
			}
		});
	}

	onUpdate(...args) {
		this.addWatch('change', ...args);
	}

	onNew(...args) {
		this.addWatch('new', ...args);
	}

	addWatch(type, files, handler) {
		this.watching[type].push(files);
		this.handlers[type].push(handler);
	}

	removeWatch (type, files, handler) {
		const index = removeByItem(this.handlers[type], handler);
		if(index !== -1) {
			removeByIndex(this.watching[type], index);	
		}
	}

	removeUpdateWatch (...args) {
		this.removeWatch('change', ...args);
	}
}
export default function (...args) {
	if (!watcher) watcher = new Watcher(...args);
	return watcher;
}
