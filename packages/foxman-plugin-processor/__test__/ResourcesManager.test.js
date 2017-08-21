const ResourcesManager = require('../lib/ResourcesManager')
const path = require('path');
const co = require('co');
const resourcesManager = new ResourcesManager();

test('set', () => {
    resourcesManager.set('/1', { 
        version: '1xxd',
        content: '1'
    });
    expect(resourcesManager._map['/1'].content).toBe('1')
})

test('get', () => {
    expect(resourcesManager.get('/1').content).toBe('1');
})


test('has', () => {
    expect(!!resourcesManager.has('/1')).toBe(true);
})

test('clear', () => {
    resourcesManager.clear('/1')
    expect(!!resourcesManager.has('/1')).toBe(false);
})