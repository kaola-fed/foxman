// const Logger = require('chalklog');
const path = require('path');
const crypto = require('crypto');
// const log = new Logger('processor-webpack');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = new MemoryFS();

function md5 (text){
    return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}

class Webpack {
    constructor(config) {
        this.config = config;
        this.compiler = null;
    }

    locate(raw) {
        return raw;
    }

    *handler({ filename }) {
        const config = this.config;
        let content = '', dependencies = [];
        
        try {
            let refs = yield new Promise((resolve, reject) => {
                const marks = md5(filename);
                
                Object.assign(config, {
                    entry: Object.assign({}, config.entry, {
                        [marks]: filename
                    }),
                    output: {
                        path: __dirname
                    }
                });
                
                const compiler = webpack(config);

                compiler.outputFileSystem = fs;
                compiler.run((err, stats) => {
                    if (!err) {
                        const dependencies = stats.compilation.fileDependencies;
                        const content = fs.readFileSync(path.join(__dirname, `${marks}.js`));
                        resolve({content, dependencies});
                    } else {
                        reject(err);
                    }
                });
            });

            content = refs.content;
            dependencies = refs.dependencies;
        } catch (e) {
            console.log(e);
        }

        return {
            content, dependencies
        };
    }
}

exports = module.exports = Webpack;
