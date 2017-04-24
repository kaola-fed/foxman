const {checkConfig} = require('../lib/index');

test('checkConfig-none', function () {
    expect(checkConfig({})).toBe('config.server.viewRoot must be string');
})

test('checkConfig-withOutSyncData', function () {
    expect(checkConfig({
        viewRoot: '1'
    })).toBe('config.server.syncData must be string');
})

test('checkConfig-withOutAsyncData', function () {
     expect(checkConfig({
        viewRoot: '1',
        syncData: '1'
    })).toBe('config.server.asyncData must be string');
})

test('checkConfig-all', function () {
     expect(checkConfig({
        viewRoot: '1',
        syncData: '1',
        asyncData: '1'
    })).toBe(undefined);
})