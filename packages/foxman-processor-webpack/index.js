// const Logger = require('chalklog');
const path = require('path');
// const log = new Logger('processor-webpack');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = new MemoryFS();

class Webpack {
    constructor(config) {
        this.config = config;
    }

    locate(raw) {
        return raw;
    }

    *handler({ filename }) {
        const config = this.config;
        let content = '', dependencies = [];
        
        try {
            content = yield new Promise(function (resolve, reject) {
                const compiler = webpack(Object.assign({}, config, {
                    entry: filename,
                    output: {
                        path: __dirname
                    }
                }));
                compiler.outputFileSystem = fs;
                compiler.run((err, stats) => {
                    if (!err) {
                        const content = fs.readFileSync(path.join(__dirname, 'main.js'));
                        resolve(content);
                    } else {
                        reject(err);
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }

        return {
            content, dependencies
        };
    }
}

exports = module.exports = Webpack;
