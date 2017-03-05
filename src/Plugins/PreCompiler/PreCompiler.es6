import vinylFs from 'vinyl-fs';
import EventEmitter from 'events';
import { util } from '../../helper';

class PreCompiler extends EventEmitter {
    /**
     * @param  {object} options
     */
    constructor(options) {
        super();
        Object.assign(this, options);
    }
    /**
     * @param  {Gulp Plugin Instance} job
     */
    pipe(job) {
        const returnDeps = info => {
            this.emit('returnDeps', info);
        };
        this.source = this.source.pipe(job);
        job.on('returnDeps', info => {
            returnDeps(info);
        }).on('returnDependencys', info => {
            returnDeps({
                source: info[0],
                deps: info.slice(1)
            });
        });
        return this;
    }

    run() {
        this.source = vinylFs.src(this.sourcePattern);
        let workFlow = this.handler(vinylFs.dest.bind(this));

        workFlow.forEach((job) => {
            this.pipe(job);
        });
        return this;
    }
}

export default PreCompiler;
