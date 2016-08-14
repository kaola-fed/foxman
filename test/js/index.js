import {inspect as insp} from 'util';
import {readFile as rf,
								writeFile as wf,
								ReadStream as rs} from 'fs';
import {join as jn} from 'path';
import {createServer as cs} from 'http';
import util from 'util';

const txtPath = jn(__dirname, 'test.txt');
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
cs(function (req, res) {
 // req.pipe(res);
 res.writeHead(200,{
 	'Content-Type': 'text/plain'
 })
 const dat = new Array();
 req.on('data',function (chunk) {
 	dat.push(chunk);
 	// res.write(chunk);
 });
 req.on('end',function() {
 	// res.write(insp(req,null,null))	
 	res.end(dat.toString('utf-8'))
 }); 
}).listen(3000);