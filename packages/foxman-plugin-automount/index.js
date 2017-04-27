const globule = require('globule');
const path = require('path');

class AutomountPlugin {
    constructor({
        syncDataMatch,
        asyncDataMatch,
        methodGetter,
        tplUrlMap = {}
    } = {}) {

        const defaultUrlGetter = filePath => {
            return '/' + filePath + '.html'; 
        };
        const defaultMethodGetter = () => {
            return 'get';
        };

        this.syncDataMatch = syncDataMatch || defaultUrlGetter;
        this.asyncDataMatch = asyncDataMatch || defaultUrlGetter;
        this.methodGetter = methodGetter || defaultMethodGetter;
        this.tplUrlMap = tplUrlMap;
    }

    init({service, getter}) {
        const createWatcher = service('watcher.create');
        const registerRouterNamespace = service('server.registerRouterNamespace');
        const {extension, viewRoot, asyncData} = getter('server');

        this.extension = {
            tpl: extension,
            data: 'json' 
        };

        this.initUrlTplMap({tplUrlMap: this.tplUrlMap});

        this.initRouterUpdater({
            viewRoot, asyncData, 
            registerRouterNamespace, createWatcher
        });
    }

    initRouterUpdater({
        viewRoot, asyncData, 
        registerRouterNamespace, createWatcher
    }) {
        const syncRouterWatcher = createWatcher(this.formatPattern(viewRoot, true));
        const asyncRouterWatcher = createWatcher(this.formatPattern(asyncData));

        const SYNCROUTER_NAMESPACE = 'automountSyncRouters';
        const ASYNCROUTER_NAMESPACE = 'automountAsyncRouters';

        const getSyncRouters = () => this.initRouters(viewRoot, true);
        const getAsyncRouters = () => this.initRouters(asyncData, false);

        const updateSyncRouters = () => registerRouterNamespace(SYNCROUTER_NAMESPACE, getSyncRouters());
        const updateAsyncRouters = () => registerRouterNamespace(ASYNCROUTER_NAMESPACE, getAsyncRouters());
        
        updateSyncRouters();
        updateAsyncRouters();

        syncRouterWatcher.on('add', updateSyncRouters);
        syncRouterWatcher.on('unlink', updateSyncRouters);

        asyncRouterWatcher.on('add', updateAsyncRouters);
        asyncRouterWatcher.on('unlink', updateAsyncRouters);
    }

    initUrlTplMap({
        tplUrlMap
    }){
        this.tplUrlMap = Object.keys(tplUrlMap).reduce((prev, url)=> {
            const tpl = tplUrlMap[url] || '';
            const tplName = this.removeExtense(tpl, true);

            return Object.assign(prev, {
                [tplName]: (prev[tplName] || []).concat([url])
            });
        }, {});
    }

    removeExtense(template = '', sync = false) {
        const reg = new RegExp('\\\.' + this.getExtense(sync) + '$', 'ig');
        return template.replace(reg, '');
    }

    transformSep(filePath) {
        return filePath.replace(/\\/g, '/');
    }

    getExtense(sync) {
        const {tpl, data} = this.extension;
        const extense = sync ? tpl :data;
        return extense;
    }

    formatPattern(base, sync = false) {
        const pattern = path.join(base, '**/**.'+ this.getExtense(sync));
        return pattern;
    }

    initRouters(base, sync) {
        const formatPattern = this.formatPattern.bind(this);
        const files = globule.find(formatPattern(base, sync));
        const methodGetter = this.methodGetter; 
        const urlMatch = sync ? (filePath) => {
            let url = this.tplUrlMap[filePath];
            if (url) {
                return url; 
            }
            return this.syncDataMatch(filePath);
        }: this.asyncDataMatch;

        const routers = files.reduce((prev, file) => {
            const filePath = this.transformSep(this.removeExtense(path.relative(base, file), sync));
            let urls = urlMatch(filePath);
           
            (Array.isArray(urls) ? urls: [urls]).forEach(url => {
                prev.push({
                    'method': methodGetter(filePath),
                    'url': url,
                    'sync': sync,
                    'filePath': filePath
                });
            });
            return prev;
        }, []);

        return routers;
    }

}
exports = module.exports = AutomountPlugin;
