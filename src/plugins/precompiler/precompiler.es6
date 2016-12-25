import { resolve, relative, sep } from 'path';
import vinylFs from 'vinyl-fs';
import EventEmitter from 'events';
import { util } from '../../helper';
// import diff from 'vinyl-fs-diff';

class PreCompiler extends EventEmitter {
	constructor(options) {
		super();
		Object.assign(this, options);
        /**
         * Vinyl-fs Ignore File Standard
         */
		if (options.ignore) {
			if (!Array.isArray(options.ignore)) {
				options.ignore = [options];
			}
			this.ignore = options.ignore.map((item) => {
				return '!' + item;
			});
		}
	}
	pipe(...args) {
		const self = this;
		this.source = this.source.pipe.apply(this.source, args);
		args[0].on('returnDeps', (info) => {
			self.emit('returnDeps', info);
		});
		return this;
	}
	
	pipeGulpDiff (workFlow) {
		// workFlow.splice(-1, 0, diff());
		return workFlow;
	}

	run() {
		let workFlow = this.handler(vinylFs.dest.bind(this));
		this.source = vinylFs.src(this.addExludeReg(this.sourcePattern));
		this.pipeGulpDiff(workFlow)
			.forEach((item) => {
				this.pipe(item);
			});
		return this;
	}
	addExludeReg(sourcePattern) {
		if (!this.ignore) {
			return sourcePattern;
		}
		if (Array.isArray(sourcePattern)) {
			return sourcePattern.concat(this.ignore);
		}
		return [sourcePattern].concat(this.ignore);
	}
}
class SinglePreCompiler extends PreCompiler {
	destInstence(sourcePattern) {
		return (dest) => {
            /**
             * @TODO Replace With Glob Standard
             */
            /**
             * 获取输入文件的相对根目录
             * @type {XML|string|void|*}
             */
			let sourceRoot = sourcePattern.replace(/\*+.*$/, '');
            /**
             * 得到输出文件的完整文件名
             */
			let output = resolve(dest, relative(sourceRoot, this.sourcePattern));
            /**
             * 输出文件
             */
			let target = sourceRoot.endsWith(sep) ? resolve(output, '..') : output;
			util.log(`${this.sourcePattern} -> ${target}`);
			return vinylFs.dest(target);
		};
	}
	runInstance(sourcePattern) {
		try {
			this.source = vinylFs.src(this.addExludeReg(this.sourcePattern));
			const workFlow = this.handler(this.destInstence.call(this, sourcePattern));
			this.pipeGulpDiff(workFlow)
				.forEach((item) => {
					this.pipe(item);
				});
		} catch (err) {
			console.log(err);
		}
		return this;
	}
}

export { SinglePreCompiler };

export default PreCompiler;

