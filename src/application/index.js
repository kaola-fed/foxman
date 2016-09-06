import Application from './Application';

let app;
export default function() {
    if (!app) {
        app = new Application();
    }
    return app;
}
