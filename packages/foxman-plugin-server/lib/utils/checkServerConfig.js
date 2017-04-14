const {util} = require('@foxman/helpers');
const {typeOf, errorLog} = util;


module.exports = function (opts) {
    const result = check(opts);
    if (result) {
        errorLog(result);
    }
};

function check ({
    viewRoot, syncData, asyncData
}) {
    if (!typeOf(viewRoot, 'string')) {
        return 'config.server.viewRoot must be string';
    }

    if (!typeOf(syncData, 'string')) {
        return 'config.server.syncData must be string';
    }

    if (!typeOf(asyncData, 'string')) {
        return 'config.server.asyncData must be string';
    }
}