const DevtoolsPlugin = require( '../lib' );

test( 'is foxman plugin', () => {
	var plugin = new DevtoolsPlugin();
	expect(typeof plugin.init).toBe( 'function' );
} );
