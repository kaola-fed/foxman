const pify = require('pify');
const del = require('del');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const pfs = Object.assign(pify(fs), {
    write(filepath, content) {
        const dir = path.dirname(filepath);
        return pify(mkdirp)(dir).then(() => {
            return pify(fs.writeFile)(filepath, content);
        });
    },
    del
});

Object.assign(pfs, {
    readJSONFile(url) {
        return pfs.readFile(url).then(json => {
            return JSON5.parse(json);
        });
    }
});

module.exports = pfs;
