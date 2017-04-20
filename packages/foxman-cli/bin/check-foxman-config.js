const {logger, consts} = require('@foxman/helpers');
const {ERRORTIPS} = consts;

module.exports = function (configPath) {
    try {
        require(configPath);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            if (~err.toString().indexOf(configPath)) {
                logger.error(ERRORTIPS.NO_CONFIG);
            } else {
                logger.error(ERRORTIPS.MAYBE_FOXMAN_CONFIG);
                logger.ln();
                logger.error(err);
                logger.ln();
                logger.error(ERRORTIPS.REINSTALL);
            }
        } else {
            logger.error(ERRORTIPS.INSTALL_LATEST_FOXMAN);
            logger.error(err);
        }
        return false;
    }
    return true;
};