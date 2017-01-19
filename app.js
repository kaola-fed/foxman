console.log([
    ' _____   _____  __    __      ___  ___       ___   __   _',
    '|  ___| /  _  \\ \\ \\  / /     /   |/   |     /   | |  \\ | | ',
    '| |__   | | | |  \\ \\/ /     / /|   /| |    / /| | |   \\| |',
    '|  __|  | | | |   }  {     / / |__/ | |   / / | | | |\\   |',
    '| |     | |_| |  / /\\ \\   / /       | |  / /  | | | | \\  |',
    '|_|     \\_____/ /_/  \\_\\ /_/        |_| /_/   |_| |_|  \\_|',
].join('\n'));
console.log('[I]'.green + ' ' + 'Loading Plugins ...');
module.exports = (process.env.NODE_ENV === 'development') ? require('./src/index.js') : require('./dist/index.js');
