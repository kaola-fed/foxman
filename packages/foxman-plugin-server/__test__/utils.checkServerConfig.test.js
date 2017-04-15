const checkServerConfig = require('../lib/utils/checkServerConfig');

test('checkServerConfig-none', function () {
    expect(checkServerConfig({})).toBe('config.server.viewRoot must be string');
})

test('checkServerConfig-withOutSyncData', function () {
    expect(checkServerConfig({
        viewRoot: '1'
    })).toBe('config.server.syncData must be string');
})

test('checkServerConfig-withOutAsyncData', function () {
     expect(checkServerConfig({
        viewRoot: '1',
        syncData: '1'
    })).toBe('config.server.asyncData must be string');
})

test('checkServerConfig-all', function () {
     expect(checkServerConfig({
        viewRoot: '1',
        syncData: '1',
        asyncData: '1'
    })).toBe(undefined);
})