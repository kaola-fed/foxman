<@compress>
<!DOCTYPE html>
<html>
  <head>
    <title> 首页设置页编辑</title>
    <#include  "../wrapper/import.ftl">
    <#include "/common/macro.ftl">
    <meta charset="utf-8"/>
    <meta name="description" content="页面描述"/>
    <meta name="keywords" content="页面描述"/>
      <@css />
      <@basecss/>
      <link href="${csRoot}/page/homepage/config/config.ftl.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>
<@topHeader />
  <div class="g-body f-clearfix">
      <div class="g-bd">
          <div class="g-bdc">
              <div class="m-main">
                  <div id="app"></div>
              </div>
          </div>
      </div>
      <@leftMenu menuObj=menuList curMenuId=requestUrl />
  </div>
  <!-- Page Content Here -->
  <!--@noparse-->
  <script>
      
  </script>
  <!--/@noparse-->
    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/page/homepage/config/config.ftl'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>