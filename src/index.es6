import run from './run';

export default function(config) {
	welcome();
	run(config);
}

function welcome() {
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
}
