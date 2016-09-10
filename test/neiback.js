import Nei from 'nei';
import {
    readFile,
    readFileSync,
    writeFileSync
} from 'fs';
import path from 'path';
import {util} from './';
const NeiApp = path.join(global.__rootdir, './node_modules/nei/bin/nei.js');

function update(config) {
    return new Promise(function(resolve, reject) {
        if (config.neiPid) {
            let success,
                update = jsSpawn([NeiApp, 'update']);

            update.stdout.on('data', (data) => {
                util.log('nei: ' + data.toString('utf-8'));
                if (/success/.test(data)) success = true;
            });
            update.stdout.on('end', () => {
                if (success) {
                    resolve();
                }
            });
            return;
        }

        util.log('nei pid未配置，你可能需要的是 nei update');
    })
}

function next() {
    util.log('start server');
}

module.exports = (config, next) => {
    if (config.pid) {
        build(config).then(next);
    } else if (config.update) {
        update(config).then(next);
    } else {
        next();
    }
}
