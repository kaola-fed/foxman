<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>wap手机专享落地页</title>
    <meta charset="utf-8"/>
    <meta name="description" content="返回结果是一个map，由于nei的限制，这里分别用属性key、value来表示"/>
    <meta name="keywords" content="返回结果是一个map，由于nei的限制，这里分别用属性key、value来表示"/>

    <@css/>
    <link href="${csRoot}pages/appgoods/list.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/appgoods/list'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>