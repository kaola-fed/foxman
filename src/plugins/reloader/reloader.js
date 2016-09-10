import EventEmitter from 'events';
import path from 'path';
import { Server as WebSocketServer } from 'ws';

class Reloader extends EventEmitter {
  constructor(options) {
    super();
    Object.assign(this, options);

    this.bindChange();
    this.buildWebSocket();
  }
  bindChange(){
    let server = this.server;
    let watcher = this.watcher;
    let view = path.resolve(server.viewRoot,'**','*.' + server.extension);
    let syncData = path.resolve(server.syncData,'**','*');
    let asyncData = path.resolve(server.asyncData,'**','*');
    let statics = [];

    server.static.forEach( item => {
      statics.push(path.resolve(item, '**', '*.css'));
      statics.push(path.resolve(item, '**', '*.js'));
    });

    this.watcher.onChange([view, syncData, asyncData], (arg0, arg1) => {
      this.reload(0, arg0);
    });

    this.watcher.onChange(statics, (arg0, arg1)=>{
      this.reload(1, arg0);
    });
  }
  buildWebSocket(){

    let serverApp = this.server.serverApp;
    this.wss = new WebSocketServer({
        server: serverApp
    });
    this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            console.log('received: %s', message);
        });
    });

    this.wss.broadcast = (data) => {
        this.wss.clients.forEach(function each(client) {
            client.send(data, function(error) {
                if (error) {
                    console.log(error);
                }
            });
        });
    };

    // var watchDirs = config.public.concat(config.ftlBase);
    // watchDirAndBroadcast(watchDirs, wss);
    serverApp.wss = this.wss;

  }
  reload(...args){
    this.wss.broadcast(path.basename(args[1]), args[0]);
  }
}
export default Reloader;
