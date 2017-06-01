const path = require('path');

const PATHES = {
    webapp: __dirname
};

Object.assign(PATHES, {
    viewRoot: path.join(PATHES.webapp, 'template'),
    syncData: path.join(PATHES.webapp, 'mock', 'sync'),
    asyncData: path.join(PATHES.webapp, 'mock', 'async')
});

Object.assign(PATHES, {
    commonTpl: path.join(PATHES.webapp, 'commonTpl')
});

Object.assign(PATHES, {
    src: path.join(__dirname, 'src')
});

module.exports = PATHES;