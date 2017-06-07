'use strict';
/**
 * foxman-plugin-smartmount
 * Created by hzwangfei3 on 2017/6/7.
 */
let globule = require('globule');
let path = require('path');
let util = require('./util');
let debug = require('debug')('foxmanPluginSmartMount');
let defReplenishUrlMap = syncFilePath => `/${syncFilePath}.html`;
let defReplenishApiMap = asyncFilePath => `/${asyncFilePath}`;

class SmartMountPlugin {
    /**
     * constructor
     * @param urlMap          {Object}   {key-url, value-mockPath}
     * @param apiMap          {Object}   {key-api, value-mockPath}
     * @param replenishUrlMap {function} tplFilePath => mockPath
     * @param replenishApiMap {function} mockFilePath => mockPath
     * @param excludePatterns {array}    ignored watch file list
     */
    constructor({
        urlMap = {},
        apiMap = {},
        replenishUrlMap = defReplenishUrlMap,
        replenishApiMap = defReplenishApiMap,
        excludePatterns = {
            urlTpl: [],
            apiJson: []
        }
    }){
        this.urlMap = typeof urlMap === 'object' ? urlMap : {};
        this.apiMap = typeof apiMap === 'object' ? apiMap : {};
        this.replenishUrlMap = typeof replenishUrlMap === 'function' ? replenishUrlMap : defReplenishUrlMap;
        this.replenishApiMap = typeof replenishApiMap === 'function' ? replenishApiMap : defReplenishApiMap;
        excludePatterns = typeof excludePatterns === 'object' ? excludePatterns : {};
        excludePatterns.urlTpl = util.fixExcludePatterns(excludePatterns.urlTpl);
        const defExcludePattern = '!**/**/_*.ftl';
        if(!~excludePatterns.urlTpl.indexOf(defExcludePattern)){
            excludePatterns.urlTpl.push(defExcludePattern);
        }
        excludePatterns.apiJson = util.fixExcludePatterns(excludePatterns.apiJson);
        this.excludePatterns = excludePatterns;
    }
    /**
     * foxman-plugin 规范
     * @param service
     * @param getter
     * @param call
     * @param names
     */
    init({ service, getter, call, names}) {// eslint-disable-line
        let createWatcher = service('watcher.create');
        let registerRouterNS = service('server.registerRouterNamespace');
        let { extension, viewRoot, asyncData } = getter('server');

        this.STUFFIXS = {
            sync: extension,
            async: 'json'
        };
        this.BASES = {
            sync: viewRoot,
            async: asyncData
        };
        this.PATTERNS = {
            sync: [
                path.join(this.BASES.sync, `**/**.${this.STUFFIXS.sync}`)
            ].concat(this.excludePatterns.urlTpl),
            async: [
                path.join(this.BASES.async, `**/**.${this.STUFFIXS.async}`)
            ].concat(this.excludePatterns.apiJson)
        };
        let urlMapFixed = util.fixPathMap(this.urlMap, this.STUFFIXS.sync, true);
        let apiMapFixed = util.fixPathMap(this.apiMap, this.STUFFIXS.async, false);
        this.urlMap = urlMapFixed.map || {};
        this.apiMap = apiMapFixed.map || {};
        this.urlRouters = urlMapFixed.routers || [];
        this.apiRouters = apiMapFixed.routers || [];

        debug(`watchPatterns: ${JSON.stringify(this.PATTERNS, null, 2)}\r\n`
            + `urlMap: ${JSON.stringify(this.urlMap, null, 2)}\r\n`
            + `apiMap: ${JSON.stringify(this.apiMap, null, 2)}`);

        this._initRouterUpdater({registerRouterNS, createWatcher});
    }

    /*
     * 计算相对地址
     * @param basePath
     * @param sync
     * @returns {*|string}
     * @private
     */
    _getRelativePath(basePath, sync){
        let prop = sync ? 'sync' : 'async';
        let stuffix = this.STUFFIXS[prop];
        let base = this.BASES[prop];
        let regStf = new RegExp(`\\.${stuffix}$`, 'g');
        return util.transformSep(path.relative(base, basePath).replace(regStf, ''));
    }

    /*
     * 同步路由
     * @returns {array|*}
     * @private
     */
    _getSyncRouters(){
        let files = globule.find(this.PATTERNS.sync);
        let syncRouters = files.reduce((prev, file) => {
            let filePath = this._getRelativePath(file, 1);

            let urls = this.replenishUrlMap(filePath);
            urls = typeof urls === 'string' ? [urls] : Array.isArray(urls) ? urls : [];
            urls = urls.map(u => util.delStartMethodStr(u));
            urls = urls.filter(u => !this.urlMap[u]);
            urls.forEach(u => prev.push({
                url: u,
                sync: true,
                method: 'GET',
                filePath
            }));
            return prev;
        }, []);
        syncRouters = this.urlRouters.concat(syncRouters);
        debug(`\r\nsyncRouters: ${JSON.stringify(syncRouters, null, 2)}`);
        return syncRouters;
    }

    /*
     * 异步（api）路由
     * @returns {array|*}
     * @private
     */
    _getAsyncRouters() {
        let pattern = this.PATTERNS.async;
        let files = globule.find(pattern);
        let apiMap = this.apiMap || {};

        let asyncRouters = files.reduce((prev, file) => {
            let filePath = this._getRelativePath(file, 0);
            let method = util.path2router(filePath).method || 'GET';

            let urls = this.replenishApiMap(filePath);
            urls = typeof urls === 'string' ? [urls] : Array.isArray(urls) ? urls : [];

            let rts = urls.map(u => util.path2router(u));
            rts = rts.filter(r => {
                let {method, url} = r;
                let existed = method !== null && apiMap[`${method} ${url}`];
                let existedGET = (method === null || method === 'GET') && apiMap[url];
                return !existed && !existedGET;
            });
            rts.forEach(r => prev.push({
                url: r.url,
                sync: false,
                method: r.method || method,
                filePath
            }));

            return prev;
        }, []);
        asyncRouters = this.apiRouters.concat(asyncRouters);
        debug(`asyncRouters: ${JSON.stringify(asyncRouters, null, 2)}`);
        return asyncRouters;
    }

    /*
     * 路由随file变化而更新
     * @param registerRouterNS
     * @param createWatcher
     * @private
     */
    _initRouterUpdater({registerRouterNS, createWatcher}) {
        let syncRouterWatcher = createWatcher(this.PATTERNS.sync);
        let asyncRouterWatcher = createWatcher(this.PATTERNS.async);
        const ROUTERS_NS_SYNC = 'smartMountSyncRouters';
        const ROUTERS_NS_ASYNC = 'smartMountAsyncRouters';

        const updateSyncRouters = () => registerRouterNS(ROUTERS_NS_SYNC, this._getSyncRouters());
        const updateAsyncRouters = () => registerRouterNS(ROUTERS_NS_ASYNC, this._getAsyncRouters());
        updateSyncRouters();
        updateAsyncRouters();

        syncRouterWatcher.on('add', updateSyncRouters);
        syncRouterWatcher.on('unlink', updateSyncRouters);
        asyncRouterWatcher.on('add', updateAsyncRouters);
        asyncRouterWatcher.on('unlink', updateAsyncRouters);
    }
}

module.exports = SmartMountPlugin;