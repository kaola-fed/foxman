import Server from './server';
import {Event, STATES, BasePlugin} from 'foxman-api';

class ServerPlugin extends BasePlugin{
  constructor(options){
    super(options);
    // this.name = 'mockServer';
    this.options = options;
  }
  onStartServer(){
    new Server( this.options ).createServer();
  }
}
export default ServerPlugin;
