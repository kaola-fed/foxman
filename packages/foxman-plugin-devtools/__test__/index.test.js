const DevtoolsPlugin = require( '../lib' );

test( 'is foxman plugin', () => {
	var plugin = new DevtoolsPlugin();
	expect(typeof plugin.init).toBe( 'function' );

	let useMock;
	const mock = jest.fn(function () {
		useMock = jest.fn();
		return useMock;
	});

	plugin.init( {
		service: mock,
	} );

	expect( mock ).toHaveBeenCalled();
	expect( useMock ).toHaveBeenCalled();

	expect( typeof plugin.name() ).toBe( 'string' );
} );
