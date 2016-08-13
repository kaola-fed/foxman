// import is supored
import {inspect} from 'util';
import {readFile} as {rf} from 'fs';
console.log(inspect({
	hello:"world"
}));


let promise = new Promise(function (reject,refuse) {
	readFile('../')
});

console.log("hello world");