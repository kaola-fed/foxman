/**
 * Created by hzxujunyu on 2016/9/22.
 */
var childProcess = require('child_process');
var n = childProcess.fork(__dirname+'/sub.js');

n.on('message', function(m) {
    console.log('Main Listen: ', m);
});
n.send({ hello: 'son' });