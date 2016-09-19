const config = require('./foxman.config');

config.argv = {
    proxy: false,
    update: false
};
require('../app.js')(config);