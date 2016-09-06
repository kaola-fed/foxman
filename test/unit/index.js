// import is supored
import {inspect} from 'util';
import {readFile} from 'fs';
import {join} from 'path';
// console.log(inspect({
// 	hello:"world"
// }));


let readfile = function (filename) {
	return new Promise(function (resolve,reject) {
		readFile(filename, (err,data)=>{
			if(err) {
				reject((err));
				return;
			}
			resolve(data);
		});
	})
};
/**readfile(join(__dirname,'test3.txt')).then((data)=>{
	console.log(data.toString('utf-8'));
	return "nihao";
}).catch(err=>console.log(err));**/



// let readfiles = ['test.txt','test2.txt'].map((filename)=>{
// 	return readfile(join(__dirname,filename));
// });
// Promise.all(readfiles)
// .then(([content1,content2])=>{
// 	console.log(content1.toString('utf-8'));
// 	console.log(content2.toString('utf-8'));
// })
// .catch(err=> console.log(err))



function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

var g = function* () {
  try {
    var foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  var it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);