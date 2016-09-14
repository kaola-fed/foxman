'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dirDispatcher = dirDispatcher;
exports.syncDispatcher = syncDispatcher;
exports.asyncDispather = asyncDispather;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _render = require('../../helper/render');

var _render2 = _interopRequireDefault(_render);

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [dirDispatcher, syncDispatcher, asyncDispather].map(regeneratorRuntime.mark);

/**
 * default dispatcher
 * @param  {[type]} config  [description]
 * @param  {[type]} this [description]
 * @return {[type]}         [description]
 */
function dirDispatcher(dispatcher, config, next) {
  var _this = this;

  var viewPath, files, promises, result, fileList;
  return regeneratorRuntime.wrap(function dirDispatcher$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          viewPath = dispatcher.path;
          _context.next = 3;
          return _helper.fileUtil.getDirInfo(viewPath);

        case 3:
          files = _context.sent;
          promises = files.map(function (file) {
            return _helper.fileUtil.getFileStat(_path2.default.resolve(viewPath, file));
          });
          _context.next = 7;
          return Promise.all(promises);

        case 7:
          result = _context.sent;
          fileList = result.map(function (item, idx) {
            return Object.assign(item, {
              name: files[idx],
              isFile: item.isFile(),
              requestPath: [_this.request.path, files[idx], item.isFile() ? '' : '/'].join('')
            });
          });
          _context.next = 11;
          return this.render('cataLog', {
            title: '查看列表',
            fileList: fileList
          });

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function syncDispatcher(dispatcher, config, next) {
  var filePath, dataPath, dataModel, output, stderr, stdout, errInfo, e, html;
  return regeneratorRuntime.wrap(function syncDispatcher$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          filePath = dispatcher.path;
          dataPath = dispatcher.dataPath;
          _context2.next = 4;
          return _helper.fileUtil.jsonResover(dataPath);

        case 4:
          dataModel = _context2.sent;

          if (dataModel) {
            _context2.next = 12;
            break;
          }

          this.type = 500;
          _context2.next = 9;
          return this.render('e', { title: '出错了', e: {
              code: 500,
              msg: '请求代理服务器异常'
            } });

        case 9:
          _context2.next = 11;
          return next;

        case 11:
          return _context2.abrupt('return', _context2.sent);

        case 12:
          output = config.renderUtil().parse(_path2.default.relative(config.viewRoot, filePath), dataModel);
          stderr = output.stderr;
          stdout = output.stdout;
          errInfo = [];
          _context2.next = 18;
          return new Promise(function (resolve, reject) {
            stderr.on('data', function (chunk) {
              errInfo.push(chunk);
            });
            stderr.on('end', function () {
              resolve(errInfo.join(''));
            });
          });

        case 18:
          e = _context2.sent;

          if (!e) {
            _context2.next = 25;
            break;
          }

          _context2.next = 22;
          return this.render('e', { title: '出错了', e: {
              code: 500,
              msg: e
            } });

        case 22:
          _context2.next = 24;
          return next;

        case 24:
          return _context2.abrupt('return', _context2.sent);

        case 25:
          html = [];
          _context2.next = 28;
          return new Promise(function (resolve, reject) {
            stdout.on('data', function (chunk) {
              html.push(chunk);
            });
            stdout.on('end', function () {
              resolve(html);
            });
          });

        case 28:

          this.type = 'text/html; charset=utf-8';
          this.body = html.join('');
          _context2.next = 32;
          return next;

        case 32:
          return _context2.abrupt('return', _context2.sent);

        case 33:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function asyncDispather(dispatcher, config, next) {
  var asyncDataPath, api;
  return regeneratorRuntime.wrap(function asyncDispather$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          /**
           * 异步接口处理
           * @type {[type]}
           */
          asyncDataPath = dispatcher.dataPath;
          _context3.next = 3;
          return _helper.fileUtil.jsonResover(asyncDataPath);

        case 3:
          api = _context3.sent;

          if (api) {
            _context3.next = 10;
            break;
          }

          _context3.next = 7;
          return this.render('e', { title: '出错了', e: {
              code: 500,
              msg: '请求代理服务器异常'
            } });

        case 7:
          _context3.next = 9;
          return next;

        case 9:
          return _context3.abrupt('return', _context3.sent);

        case 10:
          this.type = 'application/json; charset=utf-8';
          this.body = api;

          _context3.next = 14;
          return next;

        case 14:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}

exports.default = function (config) {

  return regeneratorRuntime.mark(function _callee(next) {
    var request, url, args, dispatcherMap, dispatcher, _dispatcher;

    return regeneratorRuntime.wrap(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            /**
             * 分配给不同的处理器
             * @type {Object}
             */
            request = this.request;
            url = request.path;
            args = [config, next];
            dispatcherMap = {
              'dir': dirDispatcher,
              'sync': syncDispatcher,
              'async': asyncDispather
            };
            dispatcher = void 0;

            if (!(dispatcher = dispatcherMap[this.dispatcher.type])) {
              _context4.next = 8;
              break;
            }

            _context4.next = 8;
            return (_dispatcher = dispatcher).call.apply(_dispatcher, [this, this.dispatcher].concat(args));

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee, this);
  });
};