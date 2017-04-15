const { use, run, get } = require('../lib');

class NoPendingPlugin {
    constructor() {

    }
    init() {

    }
}

class PendingPlugin {
    constructor() {

    }
    init() {
        this.pending(function (done) {
            done(0);
        })
    }
}

test('addPlugin', function() {
    use(new NoPendingPlugin());
    use(new PendingPlugin());

    expect(1).toBe(1);
});


test('Run', function() {
    return run().then(v => {
        console.log(v)
        expect(1).toBe(1);
    });
});
