const config = require('./foxman.config');

config.argv = {
    proxy: 'test',
    update: true
};
require('../')(config);