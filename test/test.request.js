/**
 * Created by hzxujunyu on 2016/9/20.
 */
var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
    'msg' : 'Hello World!'
});

var options = {
    hostname: '223.252.220.20',
    port: 80,
    path: '/wxConfig.html?url=baidu.com',
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': Buffer.byteLength(postData),
        'host':'m.kaola.com'
    }
};

var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.')
    })
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();