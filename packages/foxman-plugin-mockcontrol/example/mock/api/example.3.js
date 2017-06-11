const fs = require('fs');
const path = require('path');

module.exports = function () {
    this.body = fs.createReadStream(path.join(__dirname, './exmaple.3.txt')); 
};