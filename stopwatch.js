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
if(process.stdin.isTTY)
	process.stdin.setRawMode(true);

// Key press action captured
process.stdin.on('keypress', (str, key) => {
	switch(key.name)
	{
		case 'c':
			if(!key.ctrl)
			{
				// Start or Continue
				timer.start(timerConfig);
				break;
			}
			// else Quit
		case 'q':
			// Quit
			process.exit();
			break;
		case 'p':
			// Pause
			timer.pause();
			break;
		case 'r':
			// Reset
			timer.reset();
			break;
		case 's':
			// Stop
			timer.stop();
			break;
		default:
			break;
	}
});

