import Suite from 'intern/lib/Suite';
import Test from 'intern/lib/Test';
import ErrorFormatter from 'intern/lib/common/ErrorFormatter';
import Executor from 'intern/lib/executors/Node';
import chalk from 'chalk';
import * as logger from './logger';

interface TestError {
	name?: string;
	error: Error;
	type: string;
	suite: string;
}

const suiteTestErrorMap = new Map<string, TestError[]>();
const errorFormatter = new ErrorFormatter(new Executor());

let passCount = 0;
let failCount = 0;
let skipCount = 0;
let suiteErrorCount = 0;

intern.on('runEnd', () => {
	logger.done();
	if (suiteTestErrorMap.size > 0) {
		console.log(chalk.redBright(`
Errors
`));
		[...suiteTestErrorMap.entries()].forEach(([key, value]) => {
			console.log(`Suite: ${chalk.red(key.replace('node - ', ''))}`);
			value.forEach((testError) => {
				if (testError.type === 'test') {
					console.log(`Test: ${chalk.red(testError.name!)}\n`);
				} else {
					console.log(`${chalk.red('Suite Error')}\n`);
				}
				console.log(`   ${chalk.red(errorFormatter.format(testError.error))}\n`);
			});
		});
	}
	let summary = `TOTAL: ${passCount} passed, ${failCount} failed`;
	if (skipCount) {
		summary += `, ${skipCount} skipped`;
	}
	if (suiteErrorCount) {
		summary += `, ${skipCount} suite errors`;
	}
	console.log(`${chalk.blueBright(summary)}
`);
});

intern.on('suiteStart', (suite: Suite) => {
	if (suite.parent && !suite.parent.parent) {
		logger.start(suite.name || suite.id);
	}
});

intern.on('testEnd', (test: Test) => {
	if (test.error) {
		failCount++;
		const testErrors = suiteTestErrorMap.get(test.parentId) || [];
		testErrors.push({ suite: test.parent.name!, name: test.name, error: test.error, type: 'test' });
		suiteTestErrorMap.set(test.parentId, testErrors);
	} else if (test.skipped) {
		skipCount++;
	} else {
		passCount++;
	}
});

intern.on('suiteEnd', ({ parent, id, skipped, numFailedTests, numPassedTests, error, name }: Suite) => {
	if (!parent || parent.parent) {
		return;
	}
	const suiteName = `${name || id}${logger.padding(name || id, 40)}`;
	if (skipped) {
		logger.skipped(`${suiteName}(skipped)`);
	} else if (error) {
		suiteErrorCount++;
		const testErrors = suiteTestErrorMap.get(id) || [];
		testErrors.push({ suite: name!, error, type: 'suite' });
		suiteTestErrorMap.set(id, testErrors);
		logger.failed(`${suiteName}Suite Error`);
	} else {
		const text = `${suiteName}${numPassedTests} passed, ${numFailedTests} failed`;
		if (numFailedTests > 0) {
			logger.failed(text);
		} else {
			logger.success(text);
		}
	}
});
