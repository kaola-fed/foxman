const config = require('./foxman.config');

config.argv = {
    proxy: 'test',
    update: 0
};
require('../')(config);