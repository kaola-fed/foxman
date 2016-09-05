'use strict';
var path = require('path');
var PluginA = require('./plugin.test');
var mcss = require('./foxman-mcss');
var autoprefix = require('gulp-autoprefixer');
var root = path.join(__dirname,'src','main','webapp');
module.exports = {
 root: root,
 plugins: [
 	[PluginA, {name:'xujunyu'}]
 ],
 preCompilers:[{
    /* [1] relative to root
    ** [2] abs path is started with /
    */
     test: ['src/mcss/**/*.mcss'],
     precompiler: function (preCompiler) {
       return preCompiler.pipe(mcss())
                         .pipe(autoprefix({
                           browsers: [ 'Android >= 2.3'],
                           cascade: false}))
                         .pipe(preCompiler.dest('src/css/'));
     }
   }
 ],
 watch:{
   /**
    * absolute
    * @type {[type]}
    */
 },
  server: {
    port:      3000,
    viewRoot:  path.join(__dirname, 'ftl'),
    syncData:  path.join(__dirname, 'mock', 'fakeData'),
    asyncData: path.join(__dirname, 'mock', 'json'),
    static: [
     path.join(__dirname, 'static')
    ]
  }
};
