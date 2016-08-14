'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dirDispatcher = dirDispatcher;
exports.ftlDispatcher = ftlDispatcher;
exports.jsonDispatcher = jsonDispatcher;

var _path = require('path');

var _fileUtil = require('./fileUtil');

var _fileUtil2 = _interopRequireDefault(_fileUtil);

var _renderUtil = require('./renderUtil');

var _renderUtil2 = _interopRequireDefault(_renderUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [dirDispatcher, ftlDispatcher, jsonDispatcher].map(regeneratorRuntime.mark);

function dirDispatcher(url, path, server, context) {
	var files, promises, result, fileList;
	return regeneratorRuntime.wrap(function dirDispatcher$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _fileUtil2.default)().getDirInfo(path);

				case 2:
					files = _context.sent;
					promises = files.map(function (file) {
						return (0, _fileUtil2.default)().getFileStat((0, _path.join)(path, file));
					});
					_context.next = 6;
					return Promise.all(promises);

				case 6:
					result = _context.sent;
					fileList = result.map(function (item, idx) {
						return Object.assign(item, {
							name: files[idx],
							isFile: item.isFile(),
							url: [url, files[idx], item.isFile() ? '' : '/'].join('')
						});
					});
					_context.next = 10;
					return context.render('dir', { fileList: fileList });

				case 10:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

function ftlDispatcher(url, path, server, context) {
	var dataModelName, dataPath, dataModel, output, errInfo;
	return regeneratorRuntime.wrap(function ftlDispatcher$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					dataModelName = [url.replace(/.ftl$/, ''), '.json'].join('');
					dataPath = (0, _path.join)(server.mockFtlDir, dataModelName);
					dataModel = require(dataPath);
					output = (0, _renderUtil2.default)().parse(url, dataModel);


					context.type = 'text/html; charset=utf-8';
					context.body = output.stdout;

					errInfo = [];

					output.stderr.on('data', function (chunk) {
						errInfo.push(chunk);
					});
					output.stderr.on('end', function () {
						console.log(errInfo.join(''));
					});

				case 9:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}

function jsonDispatcher(url, path, server, context) {
	var file, readstream;
	return regeneratorRuntime.wrap(function jsonDispatcher$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					file = (0, _path.join)(server.mockJsonDir, url);
					readstream = (0, _fileUtil2.default)().getFileByStream(file);


					context.type = 'application/json; charset=utf-8';
					context.body = readstream;

				case 4:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked[2], this);
}