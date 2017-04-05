import {createSystemId} from './util';
import Events from 'events';

const idNext = createSystemId();
const msg = new Events();

class TaskLock {
    constructor() {
        this.queue = [];
    }

    push({run}) {
        const id = idNext();
        const isEmpty = this.isEmpty()
        this.queue.push({run, id});
        
        if (isEmpty) {
            this.next();
        }

        return new Promise((resolve, reject) => {
            msg.once(`task-${id}`, function ({result, error}) {
                if (result !== undefined) {
                    return resolve(result);
                }
                reject(error);
            });
        });
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    shift() {
        this.queue.shift();
        if (!this.isEmpty()) {
            this.next();
        }
    }

    next() {
        const {run, id} = this.queue[0];
        const self = this;
        run()
            .then(result => {
                msg.emit(`task-${id}`, {result});
                self.shift();
            }).catch(error => {
                msg.emit(`task-${id}`, {error});
                self.shift();
            });
    }
}

export default TaskLock;