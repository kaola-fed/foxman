const util = require('./util');
const fileUtil = require('./fileutil');
const RenderUtil = require('./render');

const DispatherTypes = {
    DIR: 'dir',
    SYNC: 'sync',
    ASYNC: 'async'
};

module.exports = { util, fileUtil, DispatherTypes, RenderUtil };
