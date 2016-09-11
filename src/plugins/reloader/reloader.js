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
    let [server,watcher] = [this.server, this.watcher];
    let reloadResources = [path.resolve(server.viewRoot,'**','*.' + server.extension),
                      path.resolve(server.syncData,'**','*'),
                      path.resolve(server.asyncData,'**','*')];

    server.static.forEach( item => {
      reloadResources.push(path.resolve(item, '**', '*.css'));
      reloadResources.push(path.resolve(item, '**', '*.js'));
    });

    this.watcher.onChange( reloadResources, ( arg0, arg1  ) => {
      this.reload( arg0 );
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
  }
  reload(...args){
    this.wss.broadcast( path.basename(args[0]) );
  }
}
export default Reloader;
