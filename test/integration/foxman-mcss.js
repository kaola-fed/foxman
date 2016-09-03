var mcss = require('mcss');

function handle(src, next, reset){
  let filename = src.path;

  var getInstance = () => {
    return mcss({
      filename
    })
  };
  var changed = (instance = getInstance())=>{
    return instance.translate().done((text) => {
      if(text){
        next(text);
      }else{
        reset();
      }
    }).fail((err) => {
        mcss.error.format(err);
        console.log(err.message);
    });
  }

  var instance = getInstance();
  changed(instance).always(()=>{
    /**
     *
     { '/home/jy/sample/fxm-dev/foxman/test/integration/src/main/webapp/src/mcss/base.mcss': '@import \'./_config.mcss\';\n.d{\n  width:200px;\n}\n',
       '/home/jy/sample/fxm-dev/foxman/test/integration/src/main/webapp/src/mcss/_config.mcss': '.c{\n  width: 100px;\n}\n' }
     */
    //  console.log(this);
     let watchFileMap = instance.get('imports');
     let watchFiles   = Object.keys(watchFileMap);
     this.onChange(watchFiles,(path,stats)=>{
       changed();
     });
  });
};
module.exports = handle;
