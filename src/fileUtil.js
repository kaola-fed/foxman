import {readdir, lstat, readFile, ReadStream} from 'fs';

let fileUtil;
class FileUtil {
	constructor(){

	}
	getFileByStream(path){
		return ReadStream(path);
	}
	
	getDirInfo(dir){
		return new Promise( (resolve,reject) => {
			readdir(dir, (err,files) => {
				if(err){return reject(err)}
				resolve(files);
			});
		});
	}

	getFileStat(file){
		return new Promise(function (resolve, reject) {
			lstat(file, function (err, stat) {
				if(err){return reject(err)}
				resolve(stat);
			});
		});
	}

	getFileContent(file){
		return new Promise( (resolve,reject) => {
			readFile(file,function (err, data) {
				if(err){return reject(err)}
				resolve(data);
			});
		});
	}

}
export default function () {
	if(!fileUtil){ fileUtil = new FileUtil();}
	return fileUtil;
};