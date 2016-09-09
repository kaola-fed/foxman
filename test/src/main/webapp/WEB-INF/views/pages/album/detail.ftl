<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>专辑——场景化商品导购页面</title>
    <meta charset="utf-8"/>
    <meta name="description" content="专辑——场景化商品导购页面"/>
    <meta name="keywords" content="专辑——场景化商品导购页面"/>

    <@css/>
    <link href="${csRoot}pages/album/detail.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/album/detail'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>