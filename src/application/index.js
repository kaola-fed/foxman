import Application from './application';

let app;
export default function() {
		if ( !app ) { app = new Application(); }
		return app;
}
