import Freemarker from 'freemarker';
import path from 'path';
import fileUtil from './fileUtil';

class RenderUtil {
	constructor({viewRoot}) {
		this.freemarker = new Freemarker({
			root: viewRoot
		});
		this.viewRoot = viewRoot;
	}
	parse(p1, data) {
		return new Promise((resolve) => {
			const _dirPath = path.resolve(p1, '..');
			const _tempPath = path.join(_dirPath, '__temp__.ftl');
			const _tpl = Object.keys(data)
				.filter( item => {
					return !~item.indexOf('.');
				}).map( item => {
					return `<#assign ${item} = ${JSON.stringify(data[item])}/>`;
				});

			fileUtil.readFile(p1)
				.then((str) => {
					_tpl.push(str);
					return fileUtil.writeFile(_tempPath, _tpl.join('\r\n'));
				})
				.catch((error) => {
					return new Promise((res, rej)=>{
						rej(error);
					});
				})
				.then(() => {
					this.freemarker.renderFile(_tempPath, {},  (error, content) => {
						resolve({
							error, content
						});
						fileUtil.delDir(_tempPath);
					});
				})
				.catch((error) => {
					resolve({
						error,
						content: null
					});
				});
		});
	}
}
export default RenderUtil;