/**
 * 通用文件系统处理
 *
 * import {getFileByStream,...} from 'fileUtil'
 * or
 *
 * import fileUtil from 'fileUtil'
 * then
 * 	fileUtil.getFileByStream
 *  ...
 */

import fs from 'fs';
import path from 'path';
import _ from './util';
import url from 'url';

export function getFileByStream (path) {
	return fs.ReadStream(path);
}

export function getDirInfo(dir){
	return new Promise( (resolve,reject) => {
		fs.readdir(dir, (err,files) => {
			if(err){return reject(err)}
			resolve(files);
		});
	});
}
export function getFileStat(file){
	return new Promise(function (resolve, reject) {
		fs.lstat(file, function (err, stat) {
			if(err){return reject(err)}
			resolve(stat);
		});
	});
}

export function readFile(file){
	return new Promise( (resolve,reject) => {
		fs.readFile(file,'utf-8',function (err, data) {
			if(err){return reject(err)}
			resolve(data);
		});
	});
}

export function writeFile(filename,text){
	return new Promise((resolve, reject)=>{
		fs.writeFile(filename,text, (err)=>{
			if(err){return reject(err)}
			resolve();
		});
	});
}

export function writeUnExistsFile ( file, text ) {
	let needCreateStack = [file];

	return new Promise((...args) => {
		const search = () => {
			file = path.resolve(file,'../');
			fs.stat(file, (err) => {
					if( err ){
						needCreateStack.push(file);
						search();
					}else{
						create();
					}
			});
		}
		const create = () => {
			let file = needCreateStack.pop();
			if(needCreateStack.length != 0){
					return fs.mkdir(file, create);
			}
			writeFile(file, text).then(...args);
		}
		search();
	});
}

export function jsonResover ( url ) {
	return new Promise( (resolve, reject) => {
		if(/^http/g.test(url)){
			_.log(`请求转发:${url}`);
			_.request({url}).then((htmlBuf)=>{
				let json;
				try{
					json = JSON.parse(htmlBuf.toString('utf-8'));
				} catch (e) {
					json = null;
				}
				resolve( json );
			},()=>{
				resolve( null );
			});
			return;
		}

		readFile(url).then( (data) => {
				resolve( JSON.parse(data) );
		},(err)=>{
			resolve( {} );
		});
	});
}


export default {
	getFileByStream,
	getDirInfo,
	getFileStat,
	readFile,
	writeFile,
	writeUnExistsFile,
	jsonResover
}
