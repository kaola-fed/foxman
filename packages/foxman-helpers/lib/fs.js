const pify = require('pify');
const del = require('del');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { parse: parseJSON } = require('./json');

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
        return pfs.readFile(url).then(buffer => buffer.toString()).then(json => {
            return parseJSON(json);
        });
    }
});

module.exports = pfs;
