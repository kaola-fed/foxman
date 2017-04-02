process.stdout.write('\x1Bc');

console.log('\n');

console.log([
    ' _____   _____  __    __      ___  ___       ___   __   _',
    '|  ___| /  _  \\ \\ \\  / /     /   |/   |     /   | |  \\ | | ',
    '| |__   | | | |  \\ \\/ /     / /|   /| |    / /| | |   \\| |',
    '|  __|  | | | |   }  {     / / |__/ | |   / / | | | |\\   |',
    '| |     | |_| |  / /\\ \\   / /       | |  / /  | | | | \\  |',
    '|_|     \\_____/ /_/  \\_\\ /_/        |_| /_/   |_| |_|  \\_|',
].join('\n'));

console.log('\n');

module.exports = (
  (process.env.NODE_ENV === 'development') ? require('./src/index.js') : require('./dist/index.js')
).default;
