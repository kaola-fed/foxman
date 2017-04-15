const Core = require('../lib');
const core = new Core();

class NoPendingPlugin {
    constructor() {}
    init() {}
}

class PendingPlugin {
    constructor() {}
    init() {
        this.pending(function(done) {
            done(0);
        });
    }
}

test('addPlugin', function() {
    core.use(new NoPendingPlugin());
    core.use(new PendingPlugin());

    expect(1).toBe(1);
});

test('Start', function() {
    return core.start().then(v => {
        console.log(v);
        expect(1).toBe(1);
    });
});
