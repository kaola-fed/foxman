var foxmanAPI = require('foxman-api');
var Event = foxmanAPI.BasePlugin;
var BasePlugin = foxmanAPI.BasePlugin;

class PluginA extends BasePlugin{
  constructor(options){
    super(options);
    // this.name = '测试插件'
  }
}
module.exports = PluginA;
