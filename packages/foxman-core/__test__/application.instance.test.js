const { init, generatePending } = require('../lib/application/Instance');

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

test('NoPendingPlugin', function() {
    const instance = new NoPendingPlugin();
    
    init(instance);
    instance.init();

    expect(instance.pendings.length).toBe(0);
});


test('PendingPlugin', function() {
    const instance = new PendingPlugin();
    
    init(instance);

    instance.init();
    
    expect(instance.pendings.length).toBe(1);
});

test('generatePending', function() {
    return generatePending(function (done) {
        done(0);
    }).then(function (v) {
        expect(v).toBe(0);
    })
});