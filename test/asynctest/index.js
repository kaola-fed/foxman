/**
 * Nei 插件
 */
class AsyncTest  {
  constructor(){

  }
  init(){
    this.async (( resolve )=>{
      resolve('ok');
    });
  }
}
export default AsyncTest;
