<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Example 2</h1>

    <p>
        JSONP DEMO
    </p>

    Hello, <span id="j-name">${name!'NULL'}</span>
    <script>
        function callback(res) {
            document.querySelector('#j-name').innerHTML = res.name;
        }
    </script>
    <script src="/jsonp.html?callback=callback&name=YourName"></script>
</body>
</html>