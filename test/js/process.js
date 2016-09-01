import {EventEmitter} from 'events';

class CO extends EventEmitter{
	constructor(){
		super();
		this.idx        = 0;
		this.midModules = [];
	}
	use( fn ){
		this.midModules.push( fn );
	}
	excute(){

		let pro     = void 0;
		const ctx   = this;
		let result  = void 0;
		let nextMod = void 0;

		function* process() {
			while(ctx.idx < ctx.midModules.length){
				nextMod = ctx.midModules[ctx.idx++];
				yield* nextMod.apply(ctx);
			}
		}

		pro    = process.apply(this);
		result = pro.next();

		while( !result.done ){
			result = pro.next();
		}
	}
}

const process = new CO();
process.use(function* (ctx) {
	console.log("use1")
});

process.use(function* (ctx) {
	console.log("use2");
});

process.excute();