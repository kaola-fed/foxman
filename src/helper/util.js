/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';
import 'colors';
import http from 'http';
import url from 'url';

export function debugLog(msg) {
  if(process.env.NODE_ENV === 'development'){
    console.log('[DEBUG]'.blue+' '+msg);
  }
}

export function error ( msg ) {
  console.log('[E]'.red+' '+msg);
  process.exit(1);
}

export function log (msg) {
  console.log('[I]'.green+' '+msg);
}

export function warnLog (msg) {
  console.log('[W]'.yellow+' '+msg);
}

export function createSystemId(){ // uid
  let currentId = 0;
  return function getNext() {
    return ++currentId;
  }
}

export function firstUpperCase (str) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
      return $1.toUpperCase() + $2;
  });
}

export function exec ( exe , success, failed) {
  child_process.exec(exe , (error, stdout, stderr) => {
    if (error) error(`exec error: ${error}`);

    if(!stderr) success(stdout);
    else failed(stderr);
  });
}

export function jsSpawn (args){
  let jsSpawn = child_process.spawn('node',args);
  jsSpawn.stderr.on('data', (data) => {
    console.log(`err: ${data}`);
  });
  return {
    stdout : jsSpawn.stdout,
    stderr : jsSpawn.stderr
  }
}

export function removeHeadBreak ( str ) {
  return str.replace( /^(\/|\\)/, '' );
}

export function removeSuffix( str ) {
  return str.replace( /\.[^\.]*$/, '' );
}

export function jsonPathResolve ( url ) {
  url = removeSuffix( url ) + '.json';

  if( /\.[^\.]*$/.test( url ) ){
    return removeHeadBreak( url);
  }
  return url;
}

export function appendHeadBreak( str ){
  if(/^[\/\\]/.test(str) ){
    return str;
  }
  return '/'+str
}

export function bufferConcat(...bufs) {
  let total = bufs.reduce( (pre, crt) => {
    return (Array.isArray(pre)?pre.length:pre) + crt.length;
  });
  return Buffer.concat(bufs, total);
};

export function dispatcherTypeCreator(type, path, dataPath) {
  return {
    type,
    path,
    dataPath
  }
}

export function request(options) {

	let urlInfo = url.parse(options.url);
	options = Object.assign({
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	}, urlInfo);

	return new Promise(( resolve, reject)=>{
		let req = http.request(options, (res) => {
      let htmlBuf = Buffer.alloc(0);

			res.setEncoding('utf8');
			res.on('data', (chunk) => {
        htmlBuf = bufferConcat(htmlBuf, Buffer.from(chunk));
			});
			res.on('end', () => {
        resolve(htmlBuf);
			});
		});

		req.on('error', (e) => {
      reject();
		  console.log(`problem with request: ${e.message}`);
		});
		req.end();
	})
}

export default {
  debugLog,
  error,
  warnLog,
  log,
  createSystemId,
  firstUpperCase,
  exec,
  jsSpawn,
  jsonPathResolve,
  removeHeadBreak,
  removeSuffix,
  appendHeadBreak,
  bufferConcat,
  dispatcherTypeCreator,
  request
};
