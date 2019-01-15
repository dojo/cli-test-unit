import * as logUpdate from 'log-update';
import * as figures from 'figures';
import chalk from 'chalk';
const stringWidth = require('string-width');
const sliceAnsi = require('slice-ansi');

const WAIT_SYMBOLS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let intervalHandle: any;
let counter = 0;

function log(symbol: string, logText: string, color: Function = chalk.blue) {
	logUpdate(color(`${symbol} ${logText}`));
}

export function padding(text: string = '', paddingLength: number, paddingChar = ' '): string {
	return sliceAnsi(paddingChar.repeat(paddingLength), 0, paddingLength - stringWidth(text));
}

export function success(logText: string) {
	log(figures.tick, logText, chalk.green);
	done();
}

export function failed(logText: string) {
	log(figures.cross, logText, chalk.red);
	done();
}

export function skipped(logText: string) {
	log(figures.line, logText, chalk.grey);
	done();
}

export function done() {
	intervalHandle && clearInterval(intervalHandle);
	logUpdate.done();
	counter = 0;
}

export function start(logText: string) {
	intervalHandle && done();
	intervalHandle = setInterval(() => {
		counter++;
		const symbol = WAIT_SYMBOLS[counter % WAIT_SYMBOLS.length];
		log(symbol, logText);
	}, 80);
}
