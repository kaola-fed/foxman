const config = require('./foxman.config');

config.argv = {
    proxy: 0,
    update: 0
};
require('../')(config);