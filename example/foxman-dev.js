const config = require('./foxman.config');

config.argv = {
    proxy: false,
    update: false
};
require('../')(config);