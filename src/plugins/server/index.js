import Server from './server';
import { Event } from '../../helper';

class ServerPlugin  {
    constructor(options){
      this.options = options;
    }
    init (){
        ( this.server = new Server( this.options ) ).createServer();
    }
}
export default ServerPlugin;
