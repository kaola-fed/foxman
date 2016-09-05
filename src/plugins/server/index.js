import Server from './server';
import {Event, STATES, BasePlugin} from 'foxman-api';

class ServerPlugin extends BasePlugin{
  beforeReady(){
    this.complete();
  }
  beforeMakeFile(){
    this.complete();
  }
  beforeServerStart(){
    this.complete();
  }
  onServerStart(){
    new Server( this.options ).createServer();
  }
}
export default ServerPlugin;
