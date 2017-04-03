import Index from './index';

export default function(...args) {
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
	Index(...args)
};
