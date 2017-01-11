const config = require('./foxman.config');

config.argv = {
    proxy: '',
    update: 0
};
require('../')(config);