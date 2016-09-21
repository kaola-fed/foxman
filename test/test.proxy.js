/**
 * Created by hzxujunyu on 2016/9/20.
 */
"use strict";
var http = require('http');
var _ = require('util');
var util = require('../dist/helper').util;
var fileUtil = require('../dist/helper').fileUtil;
var url = 'http://223.252.220.20/wxConfig.html';
util.request({
    url: url,
    headers:{
        host:"m.kaola.com"
    }
}).then((info)=>{
    let info1 = _.inspect(info, { showHidden: true, depth: null });
    fileUtil.writeUnExistsFile('result.txt',info1);
});
