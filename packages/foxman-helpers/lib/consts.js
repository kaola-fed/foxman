exports.DispatherTypes = {
    DIR: 'dir',
    SYNC: 'sync',
    ASYNC: 'async'
};

exports.ERRORTIPS = {
    NO_CONFIG: [
        `Please add foxman.config.js in current directory`,
        `Also you can appoint your special name,`,
        `use command 'foxman --config yourfoxman.config.js'.`,
        `See more in command 'foxman --help'`
    ],

    REINSTALL: `You can try 'npm install' or check the foxman.config.js`,

    MAYBE_FOXMAN_CONFIG: [
        `Make sure you have the latest version of node.js and foxman.`,
        `If you do, this is most likely a problem with the plugins used in your foxman.config.js,`,
        `not with foxman itself`
    ],

    INSTALL_LATEST_FOXMAN: [
        `Please install latest version:',`,
        `$ npm i -g foxman`,
        `And re-install all dependencies in current working directory`,
        `For more release information, head to https://github.com/kaola-fed/foxman/releases ;-)`
    ]
};
