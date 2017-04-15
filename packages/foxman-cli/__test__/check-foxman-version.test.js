const checkFoxmanVersion = require('../bin/check-foxman-version');

test('checkFoxmanVersion', function() {
     expect(checkFoxmanVersion({
         version: '0.8.0'
     })).toBe(true);
});

test('checkFoxmanVersion-noUpgrade', function() {
     expect(checkFoxmanVersion()).toBe(true);
});


test('checkFoxmanVersion-1', function() {
     expect(checkFoxmanVersion({
         version: '9.9.9'
     })).toBe(false);
});