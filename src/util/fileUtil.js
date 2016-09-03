import {readdir, lstat, readFile, writeFile, ReadStream} from 'fs';

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

	readFile(file){
		return new Promise( (resolve,reject) => {
			readFile(file,'utf-8',function (err, data) {
				if(err){return reject(err)}
				resolve(data);
			});
		});
	}
	writeFile(filename,text){
		return new Promise((resolve, reject)=>{
			writeFile(filename,text, (err)=>{
				if(err){return reject(err)}
				resolve();
			});
		});
	}
}
export default function () {
	if(!fileUtil){ fileUtil = new FileUtil();}
	return fileUtil;
};
