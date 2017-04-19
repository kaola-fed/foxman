module.exports = function(upgrade = {}) {
    const {system} = require('@foxman/helpers');
    const {checkVersion} = system;
    const pkg = require('../package.json');

    if (upgrade !== undefined && upgrade.version !== undefined) {
        let notify = [
            `Expect foxman version to be higher than v${upgrade.version} in current project!`
        ];

        if (upgrade.notify && upgrade.notify.length > 0) {
            notify = upgrade.notify;
        }

        return checkVersion({
            version: pkg.version,
            versionLimit: upgrade.version,
            notify: [
                ...notify,
                'Please install latest version:',
                '$ npm i -g foxman',
                'And re-install all dependencies in current working directory',
                'For more release information, head to https://github.com/kaola-fed/foxman/releases ;-)'
            ]
        });
    }
    
    return true;
};
