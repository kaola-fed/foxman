<@compress>
<!DOCTYPE html>
<html>
  <head>

    <#include "/common/macro.ftl">

    <title>支付认证信息不一致订单列表页</title>
    <meta charset="utf-8"/>
    <meta name="description" content="支付认证信息不一致订单列表页"/>
    <meta name="keywords" content="支付认证信息不一致订单列表页"/>

    <@css/>
    <link href="${csRoot}pages/order/inconsistent/list.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/pages/order/inconsistent/list'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>