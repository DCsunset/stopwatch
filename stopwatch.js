#!/usr/bin/env node

const { Timer } = require('easytimer.js');
const timer = new Timer();
const readline = require('readline');

function arrayToString(array) {
	return array.map(v => `'${v}'`).join(', ')
}

const validPrecisions = ['hours', 'minutes', 'seconds', 'secondTenths'];

const argv = require('yargs')
	.usage("Usage: $0 [options]")
	.option('precision', {
		alias: 'p',
		type: 'string',
		description: `The precision of stopwatch. Accepted values: ${arrayToString(validPrecisions)}. (Default: 'seconds')`
	})
	.help('help')
	.alias('help', 'h')
	.argv

if (argv.precision && !validPrecisions.includes(argv.precision)) {
	console.error(`Invalid precision. Accepted values: ${arrayToString(validPrecisions)}`);
	process.exit(1);
}

const precision = argv.precision || 'seconds';

// Set precision
const timerConfig = { precision };
timer.start(timerConfig);

function printTime() {
	const timeValue = timer.getTimeValues();
	// Overwrite the previous line
	readline.clearLine(process.stdout);
	readline.cursorTo(process.stdout, 0, null);
	// Write current time
	process.stdout.write(timeValue.toString(
		validPrecisions.slice(0, validPrecisions.indexOf(precision) + 1)
	));
}

printTime();

// Set time updated event
timer.addEventListener(`${precision}Updated`, () => {
	printTime();
});

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
	process.stdin.setRawMode(true);

// Key press action captured
process.stdin.on('keypress', (_, key) => {
	switch (key.name) {
		case 'c':
		case 'd':
			if (!key.ctrl)
				break;
			// else Quit
		case 'q':
		case 'enter':
		case 'return':
			// Quit
			process.stdout.write("\n");
			process.exit();
		case 'p':
		case 'space':
			if (timer.isRunning()) {
				// Pause
				timer.pause();
			}
			else {
				// Resume
				timer.start(timerConfig);
			}
			break;
		case 'r':
			// Reset
			timer.reset();
			break;
		case 'e':
			// End
			timer.stop();
			break;
		case 's':
			// Split
			// Record current time and continue to run
			process.stdout.write('\n');
			break;
		default:
			break;
	}
});

