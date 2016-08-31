import {Event, STATES, BasePlugin} from 'foxman-api';

class WatcherPlugin extends BasePlugin{
  constructor(options){
    super(options);
    this.options = options;
  }
  onStartServer(){
    // new Server( this.options ).createServer();
  }
}
export default WatcherPlugin;
