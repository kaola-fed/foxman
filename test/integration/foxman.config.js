'use strict';
var path = require('path');
var PluginA = require('./plugin.test');

module.exports = {
 port: '3000',
 plugins:[
 	[PluginA, {name:'xujunyu'}]
 ],
 path: {
  root:      path.join(__dirname,'src','main','webapp'),
  viewRoot:  path.join(__dirname, 'ftl'),
  syncData:  path.join(__dirname, 'mock', 'fakeData'),
  asyncData: path.join(__dirname, 'mock', 'json'),
  static: [
   path.join(__dirname, 'static')
  ]
 }
};
