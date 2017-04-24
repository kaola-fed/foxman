const path = require('path');
const { string, consts } = require('@foxman/helpers');
const { DIR, SYNC } = consts.DispatherTypes;
const {
    getMockConfig,
    writeNEIConfig,
    updateLocalFiles,
    formatRoutes,
    init
} = require('./functions');

const FROM = 'NEI';

class NEISyncPlugin {
    name() {
        return 'nei';
    }

    dependencies() {
        return [ 'server' ];
    }

    service() {
        return {};
    }

    constructor(options) {
        this.NEIInfo = init(options);
    }

    init({ service, getter }) {
        const { use, registerRouterNamespace } = service('server');

        this.$use = use;
        this.$registerRouterNamespace = registerRouterNamespace;
        this.$serverOptions = getter('server');

        const { update } = this.NEIInfo;

        this.updateNEIDataProxy({ update });
        this.registerMiddleware();
    }

    updateNEIDataProxy({ update }) {
        if (update) {
            this.syncNEIData();
        } else {
            this.useLocalData();
        }
    }

    registerMiddleware() {
        const genCommonPath = this.genCommonPath.bind(this);
        const genNeiApiUrl = this.genNeiApiUrl.bind(this);

        // update function
        this.$use(
            () =>
                function*(next) {
                    const requestPath = this.request.path;
                    if (~requestPath.indexOf('__UPDATELOCALNEI__')) {
                        return this.useLocalData();
                    }

                    yield next;
                }
        );

        this.$use(
            () =>
                function*(next) {
                    const { dispatcher = {} } = this;
                    const { router = false, type, filePath } = dispatcher;
                    const { from } = router;

                    if (type === DIR || !router || from !== FROM) {
                        return yield next;
                    }

                    const routeModel = {
                        sync: SYNC == type,
                        filePath: filePath
                    };

                    dispatcher.dataPath = [
                        genNeiApiUrl(routeModel),
                        genCommonPath(routeModel)
                    ];
                    yield next;
                }
        );
    }

    useLocalData() {
        const { serverConfigFile, NEIRoute } = this.NEIInfo;
        if (!serverConfigFile) {
            return this.syncNEIData();
        }

        this.setMock(require(serverConfigFile));
        this.updateRoutes(require(NEIRoute));
    }

    setMock({ mockApi, mockTpl }) {
        Object.assign(this.NEIInfo, {
            mock: {
                api: mockApi,
                tpl: mockTpl
            }
        });
    }

    getMock() {
        return this.NEIInfo.mock;
    }

    getNeiRoutes() {
        const { NEIRoute } = this.NEIInfo;
        delete require.cache[NEIRoute];
        return require(NEIRoute);
    }

    syncNEIData() {
        const { key, basedir } = this.NEIInfo;

        return this.pending(end => {
            return require('./NEISync')
                .run({ key, basedir })
                .then(config => this.getUpdate(config))
                .then(routes => {
                    this.updateRoutes(routes);
                    end();
                })
                .catch(e => {
                    console.error(e);
                });
        });
    }

    getUpdate(config) {
        const { routes, mockApi, mockTpl } = getMockConfig(config);
        const formatR = formatRoutes(routes);
        const getFilePath = this.genCommonPath.bind(this);

        this.setMock({ mockApi, mockTpl });
        writeNEIConfig(this.NEIInfo, formatR);

        return updateLocalFiles(formatR, getFilePath).then(() => {
            return formatR;
        });
    }

    updateRoutes(routers) {
        const addNEIMark = routers => {
            return routers.map(router => {
                return Object.assign(
                    {
                        from: FROM
                    },
                    router
                );
            });
        };

        this.$registerRouterNamespace('nei', addNEIMark(routers));
    }

    genCommonPath({ sync, filePath }) {
        const {
            syncDataMatch,
            asyncDataMatch
        } = this.$serverOptions;

        if (sync) {
            return syncDataMatch(string.jsonPathResolve(filePath));
        }

        filePath = filePath.replace(
            /(GET|DELETE|HEAD|PATCH|POST|PUT)\//i,
            ''
        );

        return asyncDataMatch(
            string.jsonPathResolve(filePath.replace(/\/data/g, ''))
        );
    }

    genNeiApiUrl({ sync, filePath }) {
        const { api, tpl } = this.getMock();
        return path.resolve(sync ? tpl : api, filePath + '.json');
    }
}

module.exports = NEISyncPlugin;
