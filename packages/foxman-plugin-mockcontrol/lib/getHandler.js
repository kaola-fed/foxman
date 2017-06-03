let { fs: pfs, path } = require('@foxman/helpers');

module.exports = function * getHandler (scriptPath) {
    let hasJs = true, handler, message;

    try {
        yield pfs.lstat(scriptPath);
    } catch (e) {
        hasJs = false;
    }

    if (hasJs) {
        try {
            handler = dynamicRequire(scriptPath);
        } catch (e) {
            message = `Load ${path.shorten(scriptPath)} error: \n ${e.stack || e}`;
            hasJs = false;
        }
    }

    return {
        hasJs, handler, message
    };
};

function dynamicRequire (scriptPath) {
    delete require.cache[scriptPath];
    return require(scriptPath);
}