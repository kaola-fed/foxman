'use strict';
/**
 * util
 * Created by hzwangfei3 on 2017/6/7.
 */
module.exports = {
    /**
     * 跟exclude类型的 pattern 数组进行检查，
     *   1.如果元素未加上'!'符号开头的，给补加上
     *   2.如果有重复，去重
     * @param excludeArr
     * @returns {[string]}
     */
    fixExcludePatterns(excludeArr = []){
        excludeArr = Array.isArray(excludeArr) ? excludeArr : [];
        excludeArr = excludeArr.filter(k => typeof k === 'string');
        excludeArr = excludeArr.map(k => (k = k.substr(0, 1)==='!' ? k : `!${k}`));
        return [...new Set(excludeArr)];
    },
    /**
     * 修复pathMap,返回一个特殊对象
     *
     * 1.清理掉每项 value 的后缀
     * 2.根据 key 判断，使得 map 中的对象唯一，返回结果在 result.map
     *   备注：'GET /','get /','GET   /'(多空格) 这几个将会判定为同一个key
     * 3.生成一个routers数组，返回结果在 result.routers
     *
     * @param pathMap
     * @param stuffix
     * @param sync
     * @return {{map: (object|*), routers: (array|*)}} result
     */
    fixPathMap(pathMap = {}, stuffix = 'json', sync = false){
        let map = {};
        let routers = [];
        stuffix = stuffix.replace(/^\./g, '');
        const regStuffix = new RegExp(`\\.${stuffix}$`, 'g');
        Object.keys(pathMap).forEach(k => {
            let v = pathMap[k];
            if(typeof v === 'string'){
                v = v.trim().replace(regStuffix, '').trim();
                let nk = k.trim();
                let {method, url} = this.path2router(nk);
                let _mth = sync ? false : method;
                nk = `${_mth?`${_mth} `:''}${url}`;
                // keep unique
                if(!map[nk]){
                    map[nk] = v;  // set resMap
                    routers.push({// push in routers
                        url,
                        sync,
                        method: method || 'GET',
                        filePath: v
                    });
                }
            }
        });
        return {map, routers};
    },
    /**
     * 将path字符串拆分成 method 和 url 两个字段
     *   1.文件路径：get/xxx -> {method:'GET', url:'xxx'}
     *   2.url地址：GET /xxx -> {method:'GET', url:'xxx'}
     * @param pathStr 可以是文件路径，也可以是url
     * @returns { {method: (string|null), url: (string)} }
     */
    path2router(pathStr = ''){
        let np = this.transformSep(pathStr).replace(/^\//g, '');
        let method = null;
        let regExStart = /^[a-zA-Z]+\s*\//g;// 同时匹配：文件夹和 url 路径，eg：文件夹'get/', url 'GET  /'
        let start = np.match(regExStart);
        if(start){
            start = start[0].toUpperCase().replace(/\/$/g, '').trim();
            let check = start.match(/^(GET)|(PUT)|(POST)|(HEAD)|(DELETE)|(OPTIONS)/g);
            if(check){
                method = check[0];
            }
        }
        let url = np.replace(new RegExp(`^${method}`, 'ig'), '').trim();
        url = url.substr(0, 1) === '/' ? url : `/${url}`;
        return {
            method,
            url
        };
    },
    /**
     * 删除 method 头
     * @param str
     * @returns {string}
     */
    delStartMethodStr(str = ''){
        return str.replace(/^(((GET)|(PUT)|(POST)|(HEAD)|(DELETE)|(OPTIONS))\s)/g, '').trim();
    },
    /**
     * 转换路径分隔符
     * @param filePath
     * @returns {string}
     */
    transformSep(filePath = ''){
        return filePath.replace(/\\/g, '/');
    }
};