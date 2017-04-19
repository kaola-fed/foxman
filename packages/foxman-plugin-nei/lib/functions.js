const { logger, string, fs } = require('@foxman/helpers');
const path = require('path');
const os = require('os');
const globule = require('globule');
const _ = require('util');

module.exports = {
    getMockConfig,
    writeNEIConfig,
    updateLocalFiles,
    formatRoutes,
    init
};

function getMockConfig(config) {
    const neiConfigRoot = path.resolve(
        config.neiConfigRoot,
        'server.config.js'
    );
    return require(neiConfigRoot);
}

function writeNEIConfig({ NEIRoute }, formatR) {
    return fs.writeFile(
        NEIRoute,
        `module.exports = ${_.inspect(formatR, { maxArrayLength: null })}`
    );
}

function updateLocalFiles(routes = [], getFilePath) {
    return Promise.all(
        routes.map(route => {
            return fs.stat(getFilePath(route)).catch(() => {
                logger.log('Touched file: ' + getFilePath(route));
                return fs.write(getFilePath(route));
            });
        })
    );
}

function formatRoutes(rules) {
    function isSync(rule) {
        return rule.hasOwnProperty('list');
    }

    function getRouteFileInfo(rule) {
        return isSync(rule)
            ? {
                filePath: rule.list[0].path,
                id: rule.list[0].id
            }
            : {
                filePath: rule.path,
                id: rule.id
            };
    }

    function getRouteURLInfo(ruleName, rule) {
        const [method, url] = ruleName.split(' ');

        return {
            method,
            url: string.appendHeadBreak(url),
            sync: isSync(rule)
        };
    }

    return Object.keys(rules).map(ruleName => {
        const rule = rules[ruleName];
        return Object.assign(
            getRouteURLInfo(ruleName, rule),
            getRouteFileInfo(rule)
        );
    });
}

function init({ key, update = false }) {
    const basedir = path.resolve(os.homedir(), 'localMock', key);
    const NEIRoute = path.resolve(basedir, 'nei.route.js');
    const [serverConfigFile] = globule.find(
        path.resolve(basedir, 'nei**/server.config.js')
    );

    return { key, update, basedir, NEIRoute, serverConfigFile };
}
