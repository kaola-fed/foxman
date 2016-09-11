'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../../helper');

exports.default = function (config) {
  var router = config.router;

  return regeneratorRuntime.mark(function _callee(next) {
    var path, method, i, route, fileWithoutExt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = this.request.path;
            method = this.request.method;

            if (path === '/' && this.request.query.mode != 1) {
              path = '/index.html';
            }
            i = 0;

          case 4:
            if (!(i < router.length)) {
              _context.next = 13;
              break;
            }

            route = router[i];

            if (!(route.method.toUpperCase() == method.toUpperCase() && route.url == path)) {
              _context.next = 10;
              break;
            }

            fileWithoutExt = _helper.util.removeSuffix(route.filePath);

            this.request.pagePath = route.sync ? fileWithoutExt + '.' + config.extension : fileWithoutExt + '.json';
            return _context.abrupt('break', 13);

          case 10:
            i++;
            _context.next = 4;
            break;

          case 13:
            _context.next = 15;
            return next;

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};