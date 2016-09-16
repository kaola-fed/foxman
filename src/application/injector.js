import {
    util
} from '../helper';

let dependencies = {};
let injector = {
	register: function ( key, value) {
        dependencies[key] = value;
    },
    resolve: function ( func, scope) {
    	const argList = func.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
    	const args = ( argList && argList[1] ) ? ( argList[1].replace(/ /g, '').split(',') ) : [];

    	let deps = args.map( ( arg ) => {
    		if(! dependencies[ arg ] ) {
				util.error(`Plugin ${arg} is not found!`);
    		}
    		return dependencies[ arg ];
    	});
        
        func.apply(scope || {}, deps);
    }
};

export default injector;