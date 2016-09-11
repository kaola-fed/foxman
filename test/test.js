var assert = require("assert");
var util = require('../dist/helper').util;

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
});
