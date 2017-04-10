const fs = require('fs');
const path = require('path');

function getFileByStream(path) {
    return fs.ReadStream(path);
}

function getDirInfo(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        });
    });
}

function getFileStat(file) {
    return new Promise(function(resolve, reject) {
        fs.lstat(file, function(err, stat) {
            if (err) {
                return reject(err);
            }
            resolve(stat);
        });
    });
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', function(err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

function writeFile(filename, text) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, text, err => {
            if (err) {
                return reject(err);
            }
            resolve(text);
        });
    });
}

function writeFileSync(filename, text) {
    fs.writeFileSync(filename, text);
}

function writeUnExistsFile(file, text) {
    let needCreateStack = [file];

    return new Promise((...args) => {
        const search = () => {
            file = path.resolve(file, '../');
            fs.stat(file, err => {
                if (err) {
                    needCreateStack.push(file);
                    search();
                } else {
                    create();
                }
            });
        };
        const create = () => {
            let file = needCreateStack.pop();
            if (needCreateStack.length != 0) {
                return fs.mkdir(file, create);
            }
            writeFile(file, text).then(...args);
        };
        search();
    });
}

function delDir(file) {
    try {
        if (fs.statSync(file).isFile()) {
            fs.unlinkSync(file);
        } else {
            var children = fs.readdirSync(file);
            if (children && children.length != 0) {
                children.forEach(function(item) {
                    delDir(path.join(file, item));
                });
            }
            fs.rmdirSync(file);
        }
    } catch (err) {
        return -1;
    }
}

module.exports = {
    getFileByStream,
    getDirInfo,
    getFileStat,
    readFile,
    writeFile,
    writeFileSync,
    writeUnExistsFile,
    delDir
};
