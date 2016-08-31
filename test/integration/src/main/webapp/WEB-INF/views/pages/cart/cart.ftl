<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>购物车页面</title>
    <meta charset="utf-8"/>
    <meta name="description" content="wap购物车"/>
    <meta name="keywords" content="wap购物车"/>

    <@css/>
    <link href="${csRoot}pages/cart/cart.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/cart/cart'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>