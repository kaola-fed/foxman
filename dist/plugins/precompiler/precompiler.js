'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _helper = require('../../helper');

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 预处理器 api，用于
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var PreCompiler = function (_EventEmitter) {
  _inherits(PreCompiler, _EventEmitter);

  function PreCompiler(options) {
    _classCallCheck(this, PreCompiler);

    var _this = _possibleConstructorReturn(this, (PreCompiler.__proto__ || Object.getPrototypeOf(PreCompiler)).call(this));

    Object.assign(_this, options);
    return _this;
  }

  _createClass(PreCompiler, [{
    key: 'pipe',
    value: function pipe() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.source = this.source.pipe.apply(this.source, args);
      Object.assign(args[0], _events2.default.prototype);
      args[0].on('returnDependencys', function (event) {
        return _this2.emit('updateWatch', event);
      });
      return this;
    }
  }, {
    key: 'dest',
    value: function dest(arg1) {
      var target = (0, _path.resolve)(this.root, arg1);
      var outputdir = (0, _path.relative)(this.file.pattern, (0, _path.resolve)(this.file.filename, '..'));
      return _vinylFs2.default.dest.call(_vinylFs2.default, (0, _path.resolve)(target, outputdir));
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      this.source = _vinylFs2.default.src(this.file.filename);
      this.handler(this.dest.bind(this)).forEach(function (item) {
        _this3.pipe(item);
      });
    }
  }, {
    key: 'run',
    value: function run() {
      this.update();
    }
  }]);

  return PreCompiler;
}(_events2.default);

exports.default = PreCompiler;