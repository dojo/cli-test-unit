import { EOL } from 'os';
import * as logUpdate from 'log-update';
import * as figures from 'figures';
import chalk from 'chalk';
const stringWidth = require('string-width');
const sliceAnsi = require('slice-ansi');

export interface Spinner {
	id: string;
	text?: string;
}

export interface SpinnerState extends Spinner {
	state: string;
	current?: string;
}

function createPadding(text: string = '', paddingLength: number, paddingChar = ' '): string {
	return sliceAnsi(paddingChar.repeat(paddingLength), 0, paddingLength - stringWidth(text));
}

export class Listy {
	private _counter = 0;

	private _symbols: any = {
		pending: figures.ellipsis,
		success: figures.tick,
		error: figures.cross,
		running: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
		skipped: figures.line
	};

	private _colours: any = {
		pending: chalk.yellow,
		success: chalk.green,
		error: chalk.red,
		running: chalk.blue,
		skipped: chalk.grey
	};

	private _spinners: SpinnerState[];
	private _spinnerMap: Map<string, SpinnerState> = new Map();
	private _timeout: any;

	constructor(spinners: Spinner[]) {
		this._spinners = spinners.map((spinner) => {
			const updatedSpinner = { ...spinner, state: 'pending', text: spinner.text ? spinner.text : spinner.id };
			this._spinnerMap.set(updatedSpinner.id, updatedSpinner);
			return updatedSpinner;
		});
		this.start();
	}

	private _loop() {
		this._logUpdate();
		if (this._allCompleted()) {
			this.done();
		} else {
			this._timeout = setTimeout(() => {
				this._counter++;
				this._loop();
			}, 80);
		}
	}

	public start() {
		this._loop();
	}

	public done() {
		clearTimeout(this._timeout);
		this._logUpdate();
		logUpdate.done();
	}

	public complete(id: string) {
		this._updateState(id, 'completed');
	}

	public success(id: string) {
		this._updateState(id, 'success');
	}

	public error(id: string) {
		this._updateState(id, 'error');
	}

	public skipped(id: string) {
		this._updateState(id, 'skipped');
	}

	public startSpinner(id: string) {
		this._updateState(id, 'running');
	}

	public addAfterText(id: string, text: string) {
		const spinner = this._spinnerMap.get(id);
		if (spinner) {
			spinner.text = `${spinner.text}${createPadding(spinner.text, 40)}${text}`;
		}
	}

	private _updateState(id: string, state: string) {
		const spinner = this._spinnerMap.get(id);
		if (spinner) {
			spinner.state = state;
		}
	}

	private _allCompleted() {
		return this._spinners.every((spinner) => spinner.state !== 'running' && spinner.state !== 'pending');
	}

	private _logUpdate() {
		this._spinners.forEach((spinner: SpinnerState) => {
			let symbol = this._symbols[spinner.state];
			if (Array.isArray(symbol)) {
				symbol = symbol[this._counter % symbol.length];
			}

			spinner.current = this._colours[spinner.state](`${symbol} ${spinner.text}`);
		});

		logUpdate(this._spinners.map((spinner) => spinner.current).join(EOL));
	}
}
