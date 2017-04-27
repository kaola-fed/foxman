const DevtoolsPlugin = require( '../lib' );

test( 'is foxman plugin', () => {
	var plugin = new DevtoolsPlugin();
	expect(typeof plugin.init).toBe( 'function' );

	const mock = jest.fn();

	plugin.init( {
		service: mock,
	} );

	expect( mock ).toHaveBeenCalled();
	expect( typeof plugin.name() ).toBe( 'string' );
} );
