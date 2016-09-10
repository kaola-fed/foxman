'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dirDispatcher = dirDispatcher;
exports.ftlDispatcher = ftlDispatcher;
exports.jsonDispatcher = jsonDispatcher;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _render = require('../../helper/render');

var _render2 = _interopRequireDefault(_render);

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _marked = [dirDispatcher, ftlDispatcher, jsonDispatcher].map(regeneratorRuntime.mark);

/**
 * default dispatcher
 * @param  {[type]} url     [description]
 * @param  {[type]} config  [description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
function dirDispatcher(url, config, context, next) {
    var viewPath, files, promises, result, fileList;
    return regeneratorRuntime.wrap(function dirDispatcher$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    viewPath = _path2.default.join(config.viewRoot, url);
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
                            url: [url, files[idx], item.isFile() ? '' : '/'].join('')
                        });
                    });
                    _context.next = 11;
                    return context.render('cataLog', {
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

function ftlDispatcher(url, config, context, next) {
    var filePath, dataPath, dataModel, output, html, errInfo;
    return regeneratorRuntime.wrap(function ftlDispatcher$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    filePath = _path2.default.join(config.viewRoot, url);
                    dataPath = config.dataMatch ? config.dataMatch(url.replace(/^(\/||\\)/, '').replace(/\.[^.]*$/, '')) : _path2.default.join(config.syncData, url.replace(/\.[^.]*$/, '.json'));
                    dataModel = {};

                    try {
                        dataModel = require(dataPath);
                    } catch (err) {
                        _helper.util.warnLog(dataPath + ' is not found!');
                    }

                    output = config.renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);
                    html = [];
                    _context2.next = 8;
                    return new Promise(function (resolve, reject) {
                        output.stdout.on('data', function (chunk) {
                            html.push(chunk);
                        });
                        output.stdout.on('end', function () {
                            if (html) {
                                context.type = 'text/html; charset=utf-8';
                                context.body = html.join('');
                                return resolve();
                            }
                            reject();
                        });
                    });

                case 8:
                    errInfo = [];


                    output.stderr.on('data', function (chunk) {
                        errInfo.push(chunk);
                    });
                    output.stderr.on('end', function () {
                        var err = errInfo.join('');
                        if (err) {
                            console.log(err);
                        }
                        // console.log(context);
                        // context.body = err;
                    });

                    _context2.next = 13;
                    return next;

                case 13:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this);
}

function jsonDispatcher(url, config, context, next) {
    var filePath, json;
    return regeneratorRuntime.wrap(function jsonDispatcher$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    filePath = _path2.default.join(config.asyncData, url);
                    json = _helper.fileUtil.getFileByStream(filePath);


                    context.type = 'application/json; charset=utf-8';
                    context.body = json;

                    _context3.next = 6;
                    return next;

                case 6:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[2], this);
}

exports.default = function (config) {
    return regeneratorRuntime.mark(function _callee(next) {
        var _routeMap;

        var url, routeMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

        return regeneratorRuntime.wrap(function _callee$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        url = this.request.pagePath || this.request.path;
                        routeMap = (_routeMap = {
                            '/': dirDispatcher
                        }, _defineProperty(_routeMap, '.' + config.extension, ftlDispatcher), _defineProperty(_routeMap, '.json', jsonDispatcher), _routeMap);
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context4.prev = 5;
                        _iterator = Object.keys(routeMap)[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context4.next = 16;
                            break;
                        }

                        route = _step.value;

                        if (!url.endsWith(route)) {
                            _context4.next = 13;
                            break;
                        }

                        _context4.next = 12;
                        return routeMap[route](url, config, this, next);

                    case 12:
                        return _context4.abrupt('return');

                    case 13:
                        _iteratorNormalCompletion = true;
                        _context4.next = 7;
                        break;

                    case 16:
                        _context4.next = 22;
                        break;

                    case 18:
                        _context4.prev = 18;
                        _context4.t0 = _context4['catch'](5);
                        _didIteratorError = true;
                        _iteratorError = _context4.t0;

                    case 22:
                        _context4.prev = 22;
                        _context4.prev = 23;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 25:
                        _context4.prev = 25;

                        if (!_didIteratorError) {
                            _context4.next = 28;
                            break;
                        }

                        throw _iteratorError;

                    case 28:
                        return _context4.finish(25);

                    case 29:
                        return _context4.finish(22);

                    case 30:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee, this, [[5, 18, 22, 30], [23,, 25, 29]]);
    });
};