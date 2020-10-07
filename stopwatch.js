#!/usr/bin/env node

const { Timer } = require('easytimer.js');
const timer = new Timer();
const readline = require('readline');

// Set precision
const timerConfig = {
	precision: 'secondTenths'
};
timer.start(timerConfig);

// Set time updated event
timer.addEventListener('secondTenthsUpdated', () => {
	const timeValue = timer.getTimeValues();
	// Overwrite the previous line
	readline.clearLine(process.stdout);
	readline.cursorTo(process.stdout, 0, null);
	// Write current time
	process.stdout.write((timeValue.toString(['hours', 'minutes', 'seconds']) + '.' + timeValue.secondTenths));
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

