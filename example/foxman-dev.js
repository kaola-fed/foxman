const config = require('./foxman.config');

config.argv = {
    proxy: 'test',
    update: false
};
require('../')(config);