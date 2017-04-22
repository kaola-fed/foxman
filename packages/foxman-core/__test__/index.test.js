const Core = require('../lib');
const core = new Core();

class NoPendingPlugin {
    constructor() {}
    init() {}
}

class PendingPlugin {
    constructor() {}
    init() {
        this.pending((done) => {
            done(0);
        });
    }
}

class ServicePlugin {
    name(){
        return 'servicer';
    }
    constructor() {
        this.$options = {a: 1};
    }
    init() {
        this.pending(function(done) {
            done(0);
        });
    }
    service() {
        return {
            a: () => {
                return 1;
            }
        }
    }
}

test('addPlugin',() => {
    core.use(new NoPendingPlugin());
    core.use(new PendingPlugin());
    core.use(new ServicePlugin());

    expect(1).toBe(1);
});

test('_service',() => {
    expect(core._service('servicer.a')()).toBe(1);
});

test('_getter',() => {
    expect(core._getter('servicer.a')).toBe(1);
});

test('Start',() => {
    return core.start().then(v => {
        console.log(v);
        expect(1).toBe(1);
    });
});

test('stop',() => {
    return core.stop().then(v => {
        expect(1).toBe(1);
    });
});

