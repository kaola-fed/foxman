const util = require('../lib').util;

test('createSystemId', ()=>{
  const f = util.createSystemId();
  const num = parseInt(Math.random()*100);
  for (var i = 0; i < num; i++) {
    f();
  }
  expect(f()).toBe(i+1);
});

test('firstUpperCase', ()=>{
  var url = 'http://www.kaola.com';
  expect(util.initialsCapitals('abb')).toBe('Abb');
});

test('removeHeadBreak', ()=>{
  expect(util.removeHeadBreak('\\nihao')).toBe('nihao');
  expect(util.removeHeadBreak('/nihao')).toBe('nihao');
});

test('removeSuffix', ()=>{
  expect(util.removeSuffix('/test/ashaioshaoishoias.json')).toBe('/test/ashaioshaoishoias');
});

test('removeSuffix2', ()=>{
  expect(util.removeSuffix('/test/ashaioshaoishoias.json', 'json')).toBe('/test/ashaioshaoishoias');
});

test('removeSuffix3', ()=>{
  expect(util.removeSuffix('/test/foo.bar', 'json')).toBe('/test/foo.bar');
});

test('jsonPathResolve', ()=>{
  expect(util.jsonPathResolve('/test/ashaioshaoishoias')).toBe('test/ashaioshaoishoias.json');
});

test('appendHeadBreak', ()=>{
  expect(util.appendHeadBreak('buisagsa')).toBe('/buisagsa');
});

test('typeof', ()=>{
    expect(util.typeOf({})).toBe('object');
});

test('sha1',()=>{
  var a = 'nihao';
  expect(util.sha1(a)).toBe('23fcf96d70494b81c5084c0da6a6e8d84a9c5d20');
});

test('parseJSON', ()=>{
  'use strict';
  expect(util.parseJSON('{a:1}').a ===1).toBe(!0);
});
