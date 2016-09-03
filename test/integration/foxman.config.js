'use strict';
var path = require('path');
var PluginA = require('./plugin.test');
var compiler1 = require('./foxman-mcss');
var compiler2 = require('./foxman-autoprefix');
var root = path.join(__dirname,'src','main','webapp');

module.exports = {
 plugins: [
 	[PluginA, {name:'xujunyu'}]
 ],
 preCompilers:[
   {
     /**
      * relative
      * @type {[type]}
      */
     test: 'src/mcss/**/*.mcss',
     precompiler: function (preCompiler) {
       return preCompiler.pipe(
         compiler1).pipe(
           compiler2).dest(
             'src/css/**/*.css');
     }
   }
 ],
 root: root,

 watch:{
   /**
    * absolute
    * @type {[type]}
    */
 },
 server: {
   viewRoot:  path.join(__dirname, 'ftl'),
  port:      3000,
  syncData:  path.join(__dirname, 'mock', 'fakeData'),
  asyncData: path.join(__dirname, 'mock', 'json'),
  static: [
   path.join(__dirname, 'static')
  ]
 }
};
