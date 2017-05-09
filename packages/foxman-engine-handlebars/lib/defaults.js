// dependencies
var camel = require('to-camel-case');
var strip = require('strip-extension');

// root directory to search for templates
exports.root = process.cwd();

// whether or not to cache templates
exports.cache = true;

// handlebars options.data
exports.data = {};

// what extension to use for templates
exports.extension = 'hbs';

// what dir contains views
exports.viewsDir = 'views';

// turn a view id into a absolute path
exports.viewPath = function(id) {
    return id;
};

// what layout (if any) should be used by default
exports.defaultLayout = null;

// what dir contains layouts
exports.layoutsDir = 'layouts';

// turn a layout id into an absolute path
exports.layoutPath = function(id) {
    return id;
};

// what dir contains partials
exports.partialsDir = 'partials';

// turn a partial relative path into an id
exports.partialId = function(file) {
    return camel(strip(file));
};

// predefined global helpers
exports.helpers = null;

// predefined global partials
exports.partials = null;
