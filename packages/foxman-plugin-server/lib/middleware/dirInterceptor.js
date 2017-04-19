const {fs, consts} = require('@foxman/helpers');
const path = require('path');
const {DIR} = consts.DispatherTypes;

module.exports = () => {
    return function*(next) {
        const dispatcher = this.dispatcher;

        if (!dispatcher || 
            (dispatcher.type !== DIR)) {
            return yield next;
        }

        const sortFiles = list => {
            return list.sort((a, b) => {
                return a.name.charAt(0).localeCompare(b.name.charAt(0));
            });
        };

        const viewPath = dispatcher.pagePath;
        const files = yield fs.getDirInfo(viewPath);
        const promises = files.map(file =>
            fs.getFileStat(path.resolve(viewPath, file)));
        let result = (yield Promise.all(promises)).map((item, idx) => {
            return Object.assign(item, {
                name: files[idx],
                isFile: item.isFile(),
                requestPath: [
                    this.request.path,
                    files[idx],
                    item.isFile() ? '' : '/'
                ].join('')
            });
        });

        const fileList = sortFiles(
            result.filter(item => {
                return item.isFile;
            })
        );
        const dirList = sortFiles(
            result.filter(item => {
                return !item.isFile;
            })
        );

        yield this.render('cataLog', {
            title: '查看列表',
            showList: dirList.concat(fileList)
        });
        yield next;
    };
};