import main from 'nei/main';
import _path from 'nei/lib/util/path';
import Builder from 'nei/lib/nei/builder';
import EventEmitter from 'events';

let subMain = main;

Object.assign(subMain, EventEmitter.prototype);

subMain.build = function (arg, action, args) {
  this.args = args;
  this.config = {
      action: action
  };
  let cwd = process.cwd() + '/';
  this.config.outputRoot = _path.normalize(_path.absolute((this.args.output || './') + '/', cwd));
  this.checkConfig();
  let loadedHandler = (ds) => {
      this.config.pid = ds.project.id;
      this.ds = ds;
      this.fillArgs();
      // 合并完参数后, 需要重新 format 一下, 并且此时需要取默认值
      this.args = arg.format(this.config.action, this.args, true);
      this.config.neiConfigRoot = `${this.config.outputRoot}nei.${this.config.pid}.${this.args.key}/`;
      new Builder({
          config: this.config,
          args: this.args,
          ds: this.ds
      });
      this.emit('updateend', this.config);
  }
  this.loadData(loadedHandler);
}

export default subMain;
