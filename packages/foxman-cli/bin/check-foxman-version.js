const { system, logger, consts } = require('@foxman/helpers');
const { checkVersion } = system;
const pkg = require('../package.json');
const { ERRORTIPS } = consts;

module.exports = function(upgrade = {}) {
    if (upgrade !== undefined && upgrade.version !== undefined) {
        let notify = [
            `Expect foxman version to be higher than v${upgrade.version} in current project!`
        ];

        if (upgrade.notify && upgrade.notify.length > 0) {
            notify = upgrade.notify;
        }

        if (
            !checkVersion({
                version: pkg.version,
                versionMin: upgrade.version
            })
        ) {
            notify.forEach(logger.error);
            logger.newline();
            logger.error(ERRORTIPS.INSTALL_LATEST_FOXMAN);

            return false;
        }
    }
    return true;
};
