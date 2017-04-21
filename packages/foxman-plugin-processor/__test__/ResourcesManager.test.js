const ResourcesManager = require('../lib/ResourcesManager')
const path = require('path');
const co = require('co');
const resourcesManager = new ResourcesManager();

test('set', () => {
    resourcesManager.set({ 
        reqPath: '/1', 
        processed: '1'
    });
    expect(resourcesManager._map['/1']).toBe('1')
})

test('get', () => {
    expect(resourcesManager.get('/1')).toBe('1');
})


test('has', () => {
    expect(resourcesManager.has('/1')).toBe(true);
})

test('clear', () => {
    resourcesManager.clear()
    expect(resourcesManager.has('/1')).toBe(true);
})