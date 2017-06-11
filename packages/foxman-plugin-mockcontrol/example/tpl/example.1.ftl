<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Example 1</h1>

    <p>
        根据请求调整响应 DEMO
    </p>

    <p>
        Jack: <a href="/example.1.ftl?name=Jack">/example.1.ftl?name=Jack</a>
    </p>

    <p>
        NotJack: <a href="/example.1.ftl?name=NotJack">/example.1.ftl?name=NotJack</a>
    </p>

    Hello, <span>${name!'NULL'}</span>
</body>
</html>
