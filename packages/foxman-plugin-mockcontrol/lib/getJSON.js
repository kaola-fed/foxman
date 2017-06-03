let { logger, path, JSON, fs: pfs } = require('@foxman/helpers');

logger = logger.createLogger('mock-control');

module.exports = function * getJSON (dataPath) {
    let hasJson = true, fileConent, parsedData, message;

    try {
        yield pfs.lstat(dataPath);
    } catch (e) {
        hasJson = false;
    }

    if (hasJson) {
        try {
            fileConent = (yield pfs.readFile(dataPath)).toString();
        } catch (e) {
            hasJson = false;
            logger.error(e);
        }

        try {
            parsedData = JSON.parse(fileConent);
        } catch (e) {
            message = `File ${path.shorten(dataPath)} parsed failed: \n ${e.stack || e}`;
        }
    }

    return {
        hasJson, parsedData, message
    };
};
