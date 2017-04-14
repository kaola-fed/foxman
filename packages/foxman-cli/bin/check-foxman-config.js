const {warnLog} = require('@foxman/helpers/lib/util');
const path = require('path');

module.exports = function (configPath) {
    try {
        require(configPath);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            if (~err.toString().indexOf(configPath)) {
                warnLog('Please add foxman.config.js in current directory.');
                warnLog('Also you can appoint your special name,');
                warnLog('use command \'foxman --config yourfoxman.config.js\'.');
                warnLog('See more in command \'foxman --help\'');
            } else {
                warnLog(
                    'Make sure you have the latest version of node.js and foxman.'
                );
                warnLog(
                    `If you do, this is most likely a problem with the plugins used in ${path.join(process.cwd(), 'foxman.config.js')},`
                );
                warnLog('not with foxman itself');
                console.log('\n');
                console.log(err.stack);
                console.log('\n');
                warnLog('You can try \'npm install\' or check the foxman.config.js');
            }
        } else {
            warnLog(
                'Maybe be a problem with foxman.config.js, check it or contact us(http://github.com/kaola-fed/foxman/issues)'
            );
            console.log(err);
        }
        process.exit(1);
    }
};