"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var router = config.router;

  return regeneratorRuntime.mark(function _callee(next) {
    var _this = this;

    var path, method;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = this.request.path;
            method = this.request.method;


            router.forEach(function (route) {
              if (route.method == method || route.url == path) {
                _this.request.handledPath = route.filePath; //.replace(/\.[^.]*?$/, 'ftl');
                return false;
              }
            });
            _context.next = 5;
            return next;

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};