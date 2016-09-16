<!DOCTYPE html>
<html>
  <head>
    <title> 链接其他系统iframe页面</title>
    <meta charset="utf-8"/>
    <meta name="description" content="页面描述"/>
    <meta name="keywords" content="页面描述"/>
      
  </head>
  <body>
  <#include "4pl/expenseTemplate/list.ftl">
  <div class="g-body f-clearfix">
      <div class="g-bd">
          <div class="g-bdc">
              <div class="m-main">
                  <div id="app">11111111111</div>
              </div>
          </div>
      </div>
  </div>
  <!-- Page Content Here -->
  <!--@noparse-->
  <script>
      
  </script>
  <!--/@noparse-->
    <script>
        NEJ.define([
            'pro/page/iframe.ftl'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
