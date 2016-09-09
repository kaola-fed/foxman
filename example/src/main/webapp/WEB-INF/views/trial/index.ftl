<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>试用中心首页</title>
    <meta charset="utf-8"/>
    <meta name="description" content="试用中心首页"/>
    <meta name="keywords" content="试用中心首页"/>

    <@css/>
    <link href="${csRoot}trial/index.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/trial/index'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>