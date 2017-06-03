<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/src/css/demo.css">
    </head>
    <body>
        <h2>Foxman Example FTL</h2>

        <#include '/inCommonTpl.ftl'>

        <section>
            Hello, ${name!''}
        </section>
        <script src="/src/javascript/page/index.js"></script>
        <script src="/dist/javascript/index.js"></script>
    </body>
</html>
