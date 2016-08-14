'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _fs = require('fs');

var _path = require('path');

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var txtPath = (0, _path.join)(__dirname, 'test.txt');
/*rf( txtPath,function(e,dat) {
	console.log(dat.toString('utf-8'));	
});*/

/**const st =rs(txtPath);
const buf = new Array();
let body = '';
st.on('data',function (chunk) {
	// console.log(chunk.toString('utf-8'));
	buf.push(chunk);
	body+=chunk;
});
st.on('end',function () {
	console.log(buf.join(''));
	console.log(body)
})**/
// console.log(st)
(0, _http.createServer)(function (req, res) {
  // req.pipe(res);
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  var dat = new Array();
  req.on('data', function (chunk) {
    dat.push(chunk);
    // res.write(chunk);
  });
  req.on('end', function () {
    // res.write(insp(req,null,null))	
    res.end(dat.toString('utf-8'));
  });
}).listen(3000);