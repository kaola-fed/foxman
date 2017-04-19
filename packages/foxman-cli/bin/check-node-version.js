module.exports = function() {
    const {system} = require('@foxman/helpers');
    const {checkVersion} = system;
    const MIN_SUPPORT_NODE_VERSION = '6.4.0';

    return checkVersion({
        version: process.version,
        versionLimit: MIN_SUPPORT_NODE_VERSION,
        notify: [
            `Expect Node.js version to be higher than v${MIN_SUPPORT_NODE_VERSION}!`,
            'Please install latest version\'s Node.js.'
        ]
    });
};
