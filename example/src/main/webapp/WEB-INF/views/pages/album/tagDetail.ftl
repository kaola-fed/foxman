<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>专辑标签分享页面</title>
    <meta charset="utf-8"/>
    <meta name="description" content="专辑标签分享页面"/>
    <meta name="keywords" content="专辑标签分享页面"/>

    <@css/>
    <link href="${csRoot}pages/album/tagDetail.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/album/tagDetail'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>