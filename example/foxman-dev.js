const config = require('./foxman.config');

config.argv = {
    proxy: 'test',
    update: 1
};
require('../')(config);