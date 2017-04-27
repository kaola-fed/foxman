class RouteDisplayPlugin {
    constructor (options) {
        this.options = options || {};
        this.options.path = this.options.path
            ? ensureSlash(this.options.path)
            : '/_routes';
    }
    init({service}) {
        const options = this.options;
        service('server.use')(() => function * (next) {
            if (this.request.path === options.path) {
                yield this.render('cataLog', {
                    title: '查看列表',
                    showList: service('server.getRuntimeRouters')()
                        .map(({url, sync}) => ({
                            isFile: true,
                            name: `【${ sync ? '同步' : '异步' }】${ url }`,
                            requestPath: url
                        }))
                });
                return 0;
            }
            yield next;
        });
    }
}

function ensureSlash(str) {
    str = String(str);
    if (str.startsWith('/')) {
        return str;
    }
    return `/${ str }`;
}

exports = module.exports = RouteDisplayPlugin;
