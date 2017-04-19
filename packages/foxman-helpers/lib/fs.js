const fs = require('fs');
const path = require('path');
const {parseJSON} = require('./parser');
const {warnLog} = require('./logger');

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

function writeUnExistsFile(file, text = '') {
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

function stat(file) {
    return Promise.resolve().then(function () {
        fs.stat(file, (error, info) => {
            /**
             * 文件不存在或者文件内容为空
             */
            if (error) {
                return Promise.reject(error);
            }
            return Promise.resolve(info);
        });
    });
}

function readJSONFile(url) {
    return new Promise(resolve => {
        let json;
        readFile(url)
            .then(data => {
                try {
                    json = parseJSON(data);
                } catch (e) {
                    warnLog('Parsed failed:');
                    warnLog(e);
                    json = {};
                }
                resolve({ json });
            })
            .catch(() => {
                resolve({ json: {} });
            });
    });
}

exports.getFileByStream = getFileByStream;
exports.getDirInfo = getDirInfo;
exports.getFileStat = getFileStat;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.writeFileSync = writeFileSync;
exports.writeUnExistsFile = writeUnExistsFile;
exports.delDir = delDir;
exports.stat = stat;
exports.readJSONFile = readJSONFile;

