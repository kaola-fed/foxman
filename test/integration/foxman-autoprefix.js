var autoprefixer = require('autoprefixer');
var postcss      = require('postcss');

module.exports = function handle(src, next){
  let text = src.text;
  if(text){
    postcss([ autoprefixer ]).process(src).then(function (result) {
        result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });
        next(result.css);
    });
    return;
  }
};
