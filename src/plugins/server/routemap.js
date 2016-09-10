export default ( config )=>{
  let router = config.router;

  return function *( next ) {
    let path = this.request.path;
    let method = this.request.method;
    if( path === '/' && this.request.query.mode!=1){ path = '/index.html' }
    for (let i = 0; i < router.length; i++) {
      let route = router[i];
      if( route.method.toUpperCase() == method.toUpperCase() &&
          route.url == path){
          this.request.pagePath = route.filePath + '.' + (route.sync ? config.extension : 'json');
          break;
      }
    }

    yield next;
  }
}
