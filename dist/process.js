"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CO = function (_EventEmitter) {
	_inherits(CO, _EventEmitter);

	function CO() {
		_classCallCheck(this, CO);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CO).call(this));

		_this.idx = 0;
		_this.midModules = [];
		return _this;
	}

	_createClass(CO, [{
		key: "use",
		value: function use(fn) {
			this.midModules.push(fn);
		}
	}, {
		key: "excute",
		value: function excute() {
			var _marked = [process].map(regeneratorRuntime.mark);

			var pro = void 0;
			var ctx = this;
			var result = void 0;
			var nextMod = void 0;

			function process() {
				return regeneratorRuntime.wrap(function process$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!(ctx.idx < ctx.midModules.length)) {
									_context.next = 5;
									break;
								}

								nextMod = ctx.midModules[ctx.idx++];
								return _context.delegateYield(nextMod.apply(ctx), "t0", 3);

							case 3:
								_context.next = 0;
								break;

							case 5:
							case "end":
								return _context.stop();
						}
					}
				}, _marked[0], this);
			}

			pro = process.apply(this);
			result = pro.next();

			while (!result.done) {
				result = pro.next();
			}
		}
	}]);

	return CO;
}(_events.EventEmitter);

var process = new CO();
process.use(regeneratorRuntime.mark(function _callee(ctx) {
	return regeneratorRuntime.wrap(function _callee$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					console.log("use1");

				case 1:
				case "end":
					return _context2.stop();
			}
		}
	}, _callee, this);
}));

process.use(regeneratorRuntime.mark(function _callee2(ctx) {
	return regeneratorRuntime.wrap(function _callee2$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					console.log("use2");

				case 1:
				case "end":
					return _context3.stop();
			}
		}
	}, _callee2, this);
}));

process.excute();