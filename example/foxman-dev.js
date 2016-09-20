const config = require('./foxman.config');

config.argv = {
    proxy: false,
    update: true
};
require('../')(config);