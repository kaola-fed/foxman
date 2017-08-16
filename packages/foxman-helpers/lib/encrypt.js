const crypto = require('crypto');

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function md5 (text){
    return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}

exports.sha1 = sha1;
exports.md5 = md5;