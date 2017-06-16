const checkFoxmanConfig = require('../lib/check-foxman-config');
const path = require('path');

test('checkFoxmanConfig', function() {
     expect(checkFoxmanConfig(path.join(__dirname, 'fixtures', 'foxman.config.js'))).toBe(true);
});

test('checkFoxmanConfigNotExist', function() {
     expect(checkFoxmanConfig(path.join(__dirname, 'fixtures', 'foxman.config.notExist.js'))).toBe(false);
});

test('checkFoxmanConfigDepNotExist', function() {
     expect(checkFoxmanConfig(path.join(__dirname, 'fixtures', 'foxman.config.1.js'))).toBe(false);
});


