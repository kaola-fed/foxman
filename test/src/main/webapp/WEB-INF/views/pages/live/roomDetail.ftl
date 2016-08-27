<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>直播间详细信息</title>
    <meta charset="utf-8"/>
    <meta name="description" content="直播间详细信息"/>
    <meta name="keywords" content="直播间详细信息"/>

    <@css/>
    <link href="${csRoot}pages/live/roomDetail.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/live/roomDetail'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>