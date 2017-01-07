var assert = require("assert");
var util = require('../../src/helper').util;

describe('util',function () {
  it('request', ()=>{
    var url = 'http://www.kaola.com';
    util.request({url}).then((html)=>{
      assert.equal(1,(function(){
        return !!html
      }()));
    });
  });

  it('createSystemId', ()=>{
    var f = util.createSystemId();
    var num = parseInt(Math.random()*100);
    for (var i = 0; i < num; i++) {
      f();
    }
    assert.equal(f(),i+1);
  });

  it('firstUpperCase', ()=>{
    var url = 'http://www.kaola.com';
    assert.equal(util.initialsCapitals('abb'),'Abb');
  });

  it('removeHeadBreak', ()=>{
    assert.equal(util.removeHeadBreak('\\nihao'),'nihao');
    assert.equal(util.removeHeadBreak('/nihao'),'nihao');
  });

  it('removeSuffix', ()=>{
    assert.equal(util.removeSuffix('/test/ashaioshaoishoias.json'),'/test/ashaioshaoishoias');
  });

  it('removeSuffix2', ()=>{
    assert.equal(util.removeSuffix('/test/ashaioshaoishoias.json', 'json'),'/test/ashaioshaoishoias');
  });

  it('removeSuffix3', ()=>{
    assert.equal(util.removeSuffix('/test/foo.bar', 'json'),'/test/foo.bar');
  });

  it('jsonPathResolve', ()=>{
    assert.equal(util.jsonPathResolve('/test/ashaioshaoishoias'),'test/ashaioshaoishoias.json');
  });

  it('appendHeadBreak', ()=>{
    assert.equal(util.appendHeadBreak('buisagsa'),'/buisagsa');
  });

  it('bufferConcat', ()=>{
      assert.equal(util.bufferConcat(new Buffer('a'),new Buffer('b')).toString('utf-8'), 'ab')
  });

  it('typeof', ()=>{
      assert.equal(util.typeOf({}),'object');
  });

  it('replaceCommet',()=>{
    assert.equal(util.replaceCommet(`/**aaa**/nihao`),'nihao');
  });

  it('removeByItem',()=>{
    var a = 'nihao';
    assert.equal(util.removeByItem(['a','b',a], a), 2);
  });

  it('removeByIndex',()=>{
    var a = 'nihao';
    assert.equal(util.removeByIndex(['a','b', a], 2), a);
  });

  it('sha1',()=>{
    var a = 'nihao';
    assert.equal(util.sha1(a), '23fcf96d70494b81c5084c0da6a6e8d84a9c5d20');
  });

});
