const mcss = require('mcss');
const Logger = require('chalklog');
const log = new Logger('processor-mcss');

class Mcss {
    constructor({
        pathes = [],
        format = 1,
        sourcemap = false,
        indent = '    '
    }) {
        pathes = pathes.filter(function(item, i) {
            if (!item) {
                log.red(
                    'new Mcss({pathes: []}) 时传入的 pathes 数组中第 ' + i + ' 项为空，请检查'
                );
                process.exit(1);
            }
            return !!item;
        });
        this.options = {
            pathes,
            format,
            sourcemap,
            indent
        };
    }

    locate(raw) {
        return raw.replace(/\.css$/g, '\.mcss');
    }

    *handler({ raw, filename }) {
        const options = Object.assign({}, this.options);
        const instance = mcss(options);
        instance.set('filename', filename);

        const result = yield new Promise((resolve, reject) => {
            instance
                .translate(raw)
                .done(text => {
                    resolve({
                        content: text,
                        dependencies: Mcss.getDependencies(instance)
                    });
                })
                .fail(reject);
        });

        return result;
    }

    static getDependencies(instance) {
        return Object.keys(instance.get('imports'));
    }
}

exports = module.exports = Mcss;
