const {checkConfig} = require('../lib/index');


test('checkConfig-withOutSyncData', function () {
    expect(checkConfig({
        viewRoot: '1'
    })).toBe('config.syncData must be string');
})

test('checkConfig-withOutAsyncData', function () {
     expect(checkConfig({
        viewRoot: '1',
        syncData: '1'
    })).toBe('config.asyncData must be string');
})

test('checkConfig-all', function () {
     expect(checkConfig({
        viewRoot: '1',
        syncData: '1',
        asyncData: '1'
    })).toBe(undefined);
})