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
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
function dirDispatcher(dispatcher, config, context, next) {
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
                            requestPath: [context.request.path, files[idx], item.isFile() ? '' : '/'].join('')
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

function syncDispatcher(dispatcher, config, context, next) {
    var _this = this;

    var filePath, dataPath, dataModel, output, errInfo;
    return regeneratorRuntime.wrap(function syncDispatcher$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    filePath = dispatcher.path;
                    dataPath = dispatcher.dataPath;
                    dataModel = {};
                    _context3.prev = 3;
                    _context3.next = 6;
                    return _helper.fileUtil.jsonResover(dataPath);

                case 6:
                    dataModel = _context3.sent;

                    console.log(dataModel);
                    _context3.next = 13;
                    break;

                case 10:
                    _context3.prev = 10;
                    _context3.t0 = _context3['catch'](3);

                    _helper.util.warnLog(dataPath + ' is not found!');

                case 13:
                    output = config.renderUtil().parse(filePath.replace(config.viewRoot, ''), dataModel);
                    errInfo = Buffer.from('<meta charset="utf-8"><pre>');
                    _context3.next = 17;
                    return new Promise(function (resolve, reject) {
                        output.stderr.on('data', function (chunk) {
                            errInfo = _helper.util.bufferConcat(errInfo, Buffer.from(chunk));
                        });
                        output.stderr.on('end', function () {
                            if (errInfo.length != 0) {
                                _helper.util.warnLog(errInfo.toString('utf-8').red);
                                context.type = 'text/html; charset=utf-8';

                                context.body = _helper.util.bufferConcat(errInfo, Buffer.from('</pre>'));
                            }
                            resolve();
                        });
                    });

                case 17:
                    if (!(errInfo.length == 0)) {
                        _context3.next = 19;
                        break;
                    }

                    return _context3.delegateYield(regeneratorRuntime.mark(function _callee() {
                        var htmlBuf;
                        return regeneratorRuntime.wrap(function _callee$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        htmlBuf = Buffer.alloc(0);
                                        _context2.next = 3;
                                        return new Promise(function (resolve, reject) {
                                            output.stdout.on('data', function (chunk) {
                                                htmlBuf = _helper.util.bufferConcat(htmlBuf, chunk);
                                            });
                                            output.stdout.on('end', function () {
                                                context.type = 'text/html; charset=utf-8';
                                                context.body = htmlBuf;
                                                resolve();
                                            });
                                        });

                                    case 3:
                                    case 'end':
                                        return _context2.stop();
                                }
                            }
                        }, _callee, _this);
                    })(), 't1', 19);

                case 19:
                    _context3.next = 21;
                    return next;

                case 21:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[1], this, [[3, 10]]);
}

function asyncDispather(dispatcher, config, context, next) {
    var asyncDataPath, api;
    return regeneratorRuntime.wrap(function asyncDispather$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    /**
                     * 异步接口处理
                     * @type {[type]}
                     */
                    asyncDataPath = dispatcher.dataPath;
                    api = _helper.fileUtil.getFileByStream(asyncDataPath);


                    context.type = 'application/json; charset=utf-8';
                    context.body = api;

                    _context4.next = 6;
                    return next;

                case 6:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _marked[2], this);
}

exports.default = function (config) {

    return regeneratorRuntime.mark(function _callee2(next) {
        var request, url, args, dispatcherMap, dispatcher;
        return regeneratorRuntime.wrap(function _callee2$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        /**
                         * 分配给不同的处理器
                         * @type {Object}
                         */
                        request = this.request;
                        url = request.path;
                        args = [config, this, next];
                        dispatcherMap = {
                            'dir': dirDispatcher,
                            'sync': syncDispatcher,
                            'async': asyncDispather
                        };
                        dispatcher = void 0;

                        if (!(dispatcher = dispatcherMap[this.dispatcher.type])) {
                            _context5.next = 8;
                            break;
                        }

                        _context5.next = 8;
                        return dispatcher.apply(undefined, [this.dispatcher].concat(args));

                    case 8:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee2, this);
    });
};