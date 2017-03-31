import path from 'path';
import {util, DispatherTypes} from '../../helper';
import {getMockConfig, writeNEIConfig, updateLocalFiles, formatRoutes, initData} from './functions'

/**
 * Nei 插件
 */
class NEISyncPlugin {
    constructor(options) {
        this.NEIInfo = initData(options);
    }

    init(serverPlugin) {
        this.server = serverPlugin.server;
        const {update} = this.NEIInfo;

        if (update) {
            this.syncNEIData();
        } else {
            this.useLocalData();
        }
    }

    useLocalData() {
        const {serverConfigFile, NEIRoute} = this.NEIInfo;
        if (!serverConfigFile) {
            return this.syncNEIData();
        }

        this.setMock(require(serverConfigFile));
        this.updateRoutes(require(NEIRoute));
    }

    setMock({mockApi, mockTpl}) {
        Object.assign(this.NEIInfo,
            {
                mock: {
                    api: mockApi,
                    tpl: mockTpl
                }
            }
        );
    }

    getMock() {
        return this.NEIInfo.mock;
    }

    getNeiRoutes() {
        const {NEIRoute} = this.NEIInfo;
        delete require.cache[NEIRoute];
        return require(NEIRoute);
    }

    syncNEIData() {
        const {key, basedir} = this.NEIInfo;

        return this.pending(end => {
            return require('./NEISync')
                .default
                .run({key, basedir})
                .then(config => this.getUpdate(config))
                .then(routes => {
                    this.updateRoutes(routes);
                    end();
                })
                .catch(e => {
                    console.error(e);
                })
        });
    }

    getUpdate(config) {
        const {routes, mockApi, mockTpl} = getMockConfig(config);
        const formatR = formatRoutes(routes);
        const getFilePath = this.genCommonPath.bind(this);

        this.setMock({mockApi, mockTpl});
        writeNEIConfig(this.NEIInfo, formatR);

        return updateLocalFiles(formatR, getFilePath).then(() => {
            return formatR;
        });
    }

    updateRoutes(routes) {
        const genCommonPath = this.genCommonPath.bind(this);
        const genNeiApiUrl = this.genNeiApiUrl.bind(this);
        const server = this.server;
        server.routers = server.routers.concat(routes);

        server.use(() => function *(next) {
            const {dispatcher} = this;

            if (!dispatcher
                || dispatcher.type == DispatherTypes.DIR
                || !dispatcher.isRouter) {
                return yield next;
            }

            const routeModel = {
                sync: DispatherTypes.SYNC == dispatcher.type,
                filePath: dispatcher.filePath,
            };
            const commonPath = genCommonPath(routeModel);

            dispatcher.dataPath = [genNeiApiUrl(routeModel), commonPath];
            yield next;
        });
    }

    genCommonPath(route) {
        const server = this.server;
        let filePath = route.filePath;

        if (route.sync) {
            return server.syncDataMatch(util.jsonPathResolve(route.filePath));
        }

        if (!server.divideMethod) {
            const methodReg = /(GET|DELETE|HEAD|PATCH|POST|PUT)\//i;
            filePath = filePath.replace(methodReg, '');
        }

        return server.asyncDataMatch(util.jsonPathResolve(filePath.replace(/\/data/g, '')));
    }

    genNeiApiUrl(route) {
        const {api, tpl} = this.getMock();
        return path.resolve(route.sync ? tpl : api, route.filePath + '.json');
    }
}

export default NEISyncPlugin;
