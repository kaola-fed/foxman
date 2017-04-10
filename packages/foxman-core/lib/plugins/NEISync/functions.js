const {util, fileUtil} = require( '../../helper' );
const path = require( 'path' );
const fs = require( 'fs' );
const os = require( 'os' );
const globule = require( 'globule' );
const _ = require( 'util' );

module.exports = { getMockConfig, writeNEIConfig, updateLocalFiles, formatRoutes, init };

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
        new Promise((resolve) => {
            /**
             * 本地路径（非nei）
             */
            let dataPath = getFilePath(route);
            fs.stat(dataPath, error => {
                /**
                 * 文件不存在或者文件内容为空
                 */
                if (error) {
                    util.log('touch file: ' + dataPath);
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
        };
    }

    return Object.keys(rules).map(ruleName => {
        const rule = rules[ruleName];
        return Object.assign(
            getRouteURLInfo(ruleName, rule),
            getRouteFileInfo(rule));
    });
}

function init({key, update = false}) {
    const basedir = path.resolve(os.homedir(), 'localMock', key);
    const NEIRoute = path.resolve(basedir, 'nei.route.js');
    const [serverConfigFile] = globule.find(path.resolve(basedir, 'nei**/server.config.js'));

    return {key, update, basedir, NEIRoute, serverConfigFile};
}
