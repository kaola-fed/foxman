import Server from './server';
import {
    Event,
    BasePlugin
} from '../../helper';

class ServerPlugin extends BasePlugin {
    init (){
        new Server(this.options).createServer();
    }
}
export default ServerPlugin;
