/**
 * BasePlugin class
 */
class BasePlugin {
  constructor(options){
    this.options = options;
  }
  onReady () {
    // console.log('onCreate');
  }
  onMakeFile () {
    // console.log('onServerBuild');
  }
  onServerStart () {
    // console.log('onServerBuild');
  }
};

export default BasePlugin;
