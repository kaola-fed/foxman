const config = require('./foxman.config');

config.argv = {
    proxy: 0,
    update: 1
};
require('../')(config);