const crypto = require('crypto');

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

exports.sha1 = sha1;