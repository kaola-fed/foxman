'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('nei/lib/util/util');

var _util2 = _interopRequireDefault(_util);

var _submain = require('./submain');

var _submain2 = _interopRequireDefault(_submain);

var _args = require('nei/lib/util/args');

var _args2 = _interopRequireDefault(_args);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_util2.default.checkNodeVersion();

var options = {
  package: require('nei/package.json'),
  message: require('nei/bin/config.js'),
  update: function update(event) {
    var _this = this;

    var action = 'update';
    var config = event.options || {};
    config = this.format(action, config);
    _submain2.default.update(this, action, config);

    /**
     * 往外传递
    */
    _submain2.default.on('updateend', function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this.emit.apply(_this, ['updateend'].concat(args));
    });
  }
};

var nei = new _args2.default(options),
    neiTools = {
  update: function update() {
    return new Promise(function (resolve, reject) {
      nei.exec('update');
      nei.on('updateend', function () {
        resolve.apply(undefined, arguments);
      });
    });
  }
};

exports.default = neiTools;