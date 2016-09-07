'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if (!app) {
        app = new _Application2.default();
    }
    return app;
};

var _Application = require('./Application');

var _Application2 = _interopRequireDefault(_Application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = void 0;