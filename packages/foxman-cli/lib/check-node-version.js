const { system, logger } = require('@foxman/helpers');
const { checkVersion } = system;
const MIN_SUPPORT_NODE_VERSION = '6.4.0';

module.exports = function() {
    if (
        !checkVersion({
            version: process.version,
            versionMin: MIN_SUPPORT_NODE_VERSION
        })
    ) {
        logger.error(
            `Expect Node.js version to be higher than v${MIN_SUPPORT_NODE_VERSION}!` +
                '\n' +
                `Please install latest version's Node.js.`
        );
        return false;
    }

    return true;
};
