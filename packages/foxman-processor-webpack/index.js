const Logger = require('chalklog');
const path = require('path');
const crypto = require('crypto');
const log = new Logger('processor-webpack');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = new MemoryFS();

function md5 (text){
    return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}

function relative(filename) {
    return '[CWD]' + path.relative(process.cwd(), filename);
}

class Webpack {
    constructor(config) {
        this.config = config;
        this.compiler = null;
        this.compilerMap = new Map();
    }

    locate(raw) {
        return raw;
    }

    *handler({ filename }) {
        const config = this.config;
        let content = '', dependencies = [], compilerMap = this.compilerMap;
        const marks = md5(filename);
        const outputPath = process.cwd();
        
        if (typeof this.compilerMap.get(filename) === 'undefined') {
            Object.assign(config, {
                entry: {
                    [marks]: filename
                },
                output: {
                    path: outputPath
                }
            });

            const compiler = webpack(config);
            compiler.outputFileSystem = fs;
            
            const callback = (...args) => {
                if (args.length === 2 && typeof args[1] === 'function') {
                    args[1]();
                }
            };
            compiler.plugin('done', () => {
                log.green(`File ${relative(filename)}, build successfully!`);
            });
            compiler.plugin('invalid', callback);
            compiler.plugin('watch-run', callback);
            compiler.plugin('run', callback);
            compilerMap.set(filename, compiler);
        }

        const compiler = compilerMap.get(filename);

        try {
            let stats = yield new Promise((resolve, reject) => {
                compiler.run((err, stats) => {
                    if (err) {
                        return reject(err);
                    }
                    return process.nextTick(() => 
                        resolve(stats)
                    );
                });
            });

            const dependencies = stats.compilation.fileDependencies;
            let content;

            try {
                content = fs.readFileSync(path.join(outputPath, `${marks}.js`)); 
            } catch(e) {
                content = e;
            }

            return {
                content, dependencies
            };
        } catch (e) {
            log.yellow(e);
        }

        return {
            content, dependencies
        };
    }
}

exports = module.exports = Webpack;
