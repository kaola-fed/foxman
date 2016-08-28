/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';

export function error ( msg ) {
  console.log(`Error:\n  ${msg}`);
  process.exit(1);
}

export function firstUpperCase (str) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
      return $1.toUpperCase() + $2;
  });
}

export function log (msg) {
	console.log(`Msg:\n  ${msg}`);
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
