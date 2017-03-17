// import neiTools from './nei';
import path from 'path';
import fs from 'fs';
import os from 'os';
import {util, fileUtil, DispatherTypes} from '../../helper';
import _ from 'util';
import globule from 'globule';

function getMockConfig(config) {
    const neiConfigRoot = path.resolve(config.neiConfigRoot, 'server.config.js');
    return require(neiConfigRoot);
}

function writeNEIConfig({NEIRoute}, formatR) {
    fileUtil.writeFile(NEIRoute, `module.exports = ${_.inspect(formatR, {maxArrayLength: null})}`, () => {
    }, (e) => {
        util.error(e);
    });
}

function updateLocalFiles(routes = [], getFilePath) {
    return Promise.all(routes.map((route) =>
        new Promise((resolve, reject) => {
            /**
             * 本地路径（非nei）
             */
            let dataPath = getFilePath(route);
            fs.stat(dataPath, error => {
                /**
                 * 文件不存在或者文件内容为空
                 */
                if (error) {
                    util.log('make empty file: ' + dataPath);
                    fileUtil.writeUnExistsFile(dataPath, '').then(resolve, resolve);
                    return 0;
                }
                resolve();
            });
        })));
}

function formatRoutes(rules) {
    function isSync(rule) {
        return rule.hasOwnProperty('list');
    }

    function getRouteFileInfo(rule) {
        return isSync(rule) ? {
            filePath: rule.list[0].path,
            id: rule.list[0].id
        } : {
            filePath: rule.path,
            id: rule.id
        };
    }

    function getRouteURLInfo(ruleName, rule) {
        const [method, url] = ruleName.split(' ');

        return {
            method,
            url: util.appendHeadBreak(url),
            sync: isSync(rule),
        }
    }

    return Object.keys(rules).map(ruleName => {
        const rule = rules[ruleName];
        return Object.assign(
            getRouteURLInfo(ruleName, rule),
            getRouteFileInfo(rule));
    });
}


function initData({key, update = false}) {
    const basedir = path.resolve(os.homedir(), 'localMock', key);
    const NEIRoute = path.resolve(basedir, 'nei.route.js');
    const [serverConfigFile] = globule.find(path.resolve(basedir, 'nei**/server.config.js'));

    return {key, update, basedir, NEIRoute, serverConfigFile};
}

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
            const dispatcher = this.dispatcher;

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
            const methodReg = /(GET)|(DELETE)|(HEAD)|(PATCH)|(POST)|(PUT)\//i;
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
