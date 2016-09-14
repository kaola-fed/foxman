var assert = require("assert");
var util = require('../dist/helper').util;
var fileUtil = require('../dist/helper').fileUtil;

describe('foxman', function() {
    it('basePlugin', function() {

    });
});

describe('util',function () {
  it('request', ()=>{
    let url = 'http://www.kaola.com';
    util.request({url}).then((html)=>{
      assert.equal(1,(function(){
        return !!html
      }()));
    });
  });

  it('createSystemId', ()=>{
    let f = util.createSystemId();
    var num = parseInt(Math.random()*100);
    for (var i = 0; i < num; i++) {
      f();
    }
    assert.equal(f(),i+1);
  });

  it('firstUpperCase', ()=>{
    let url = 'http://www.kaola.com';
    assert.equal(util.firstUpperCase('abb'),'Abb');
  });

  it('removeHeadBreak', ()=>{
    assert.equal(util.removeHeadBreak('\\nihao'),'nihao');
    assert.equal(util.removeHeadBreak('/nihao'),'nihao');
  });

  it('removeSuffix', ()=>{
    assert.equal(util.removeSuffix('/test/ashaioshaoishoias.json'),'/test/ashaioshaoishoias');
  });

  it('jsonPathResolve', ()=>{
    assert.equal(util.jsonPathResolve('/test/ashaioshaoishoias'),'test/ashaioshaoishoias.json');
  });

  it('appendHeadBreak', ()=>{
    assert.equal(util.appendHeadBreak('buisagsa'),'/buisagsa');
  });

  it('jsonResover', ()=>{
    fileUtil.jsonResover('./file.txt').then((res)=>{
      assert.equal(1,(function (res) {
        return (res.test=="nihao");
      }()));
    });
  });

});
