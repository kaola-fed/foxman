'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var router = config.router;

  return regeneratorRuntime.mark(function _callee(next) {
    var path, method, i, route;
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
              _context.next = 12;
              break;
            }

            route = router[i];

            if (!(route.method.toUpperCase() == method.toUpperCase() && route.url == path)) {
              _context.next = 9;
              break;
            }

            this.request.pagePath = route.filePath + '.' + (route.sync ? config.extension : 'json');
            return _context.abrupt('break', 12);

          case 9:
            i++;
            _context.next = 4;
            break;

          case 12:
            _context.next = 14;
            return next;

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};