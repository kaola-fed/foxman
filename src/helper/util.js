/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';
import 'colors';

export function debugLog(msg) {
  if(process.env.NODE_ENV === 'development'){
    console.log('[D]'.blue+' '+msg);
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
  return str.replace( /^(\/||\\)/, '' );
}

export function removeSuffix( str ) {
  return str.replace( /\.[^\.]*$/, '' );
}

export function jsonPathResolve ( url ) {
  if( /\.[^\.]*$/.test( url ) ){
    return removeHeadBreak( url + '.json');
  }
  return (removeSuffix( url )+'.json');
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
  removeSuffix
};
