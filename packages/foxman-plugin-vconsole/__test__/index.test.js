const VConsolePlugin = require( '../lib' );

test( 'basic', () => {
	const plugin = new VConsolePlugin();

	const mockFn = jest.fn();
	plugin.init( {
		service() {
			return mockFn;
		}
	} );

	expect( typeof plugin.name() ).toBe( 'string' );
	expect( plugin.dependencies() ).toHaveLength(1);
	expect( typeof plugin.init ).toBe( 'function' );
	expect( mockFn ).toHaveBeenCalledTimes(2);
} );
