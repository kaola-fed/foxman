/**
 * Created by hzxujunyu on 2016/9/20.
 */
"use strict";
var http = require('http');
var _ = require('util');
var util = require('../src/helper').util;
var fileUtil = require('../src/helper').fileUtil;
var url = 'http://m.kaola.com/';
http.get(url, function(res){
    var data = [];
    res.on('data', (chunk)=>{
        data.push(chunk);
    });
    res.on('end', ()=>{
        console.log(Buffer.concat(data).toString('utf-8'));
        console.log('end');
    })
    console.log('ok');
});