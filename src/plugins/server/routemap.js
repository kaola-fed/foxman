export default ( config )=>{
  let router = config.router;

  return function *( next ) {
    let path = this.request.path;
    let method = this.request.method;
    
    router.forEach( route => {
      if( route.method == method ||
          route.url == path){
          this.request.handledPath = route.filePath;//.replace(/\.[^.]*?$/, 'ftl');
          return false;
      }
    });
    yield next;
  }
}
