
// import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';
import _delay from './_delay';

var EMPTY_TASK = function (next) { next(); }

type RetryOptions = {
	timeout ?: number,
	retries ?: number,
};

type DelayArgs = {
	err ?: any,
	retries : number,
	delay : number,
	timeStarted : number,
};

type DelayFunction =
	(args : DelayArgs) => number;

const DefaultDelayBuilder = (options : any = {}) : DelayFunction => {
	const timeout = options.timeout || 8192;
	const retries = options.retries || 8;

	const delayFunc : DelayFunction = function (args) {
		const elapsedTime = Date.now() - args.timeStarted;
		if (elapsedTime > timeout || args.retries > retries) {
			return -1;
		} else {
			const delay = (1 << args.retries);
			return delay;
		}
	};

	return delayFunc;
}

/**
*
* `Retry` eraps a task and attempts to retry if it throws an error, with different kinds of retry strategies (manual, linear or exponential backoff)
*
* @param {CallbackTask} task - the task to wrap.
* @param {function} retryStrategy - an optional retry strategy.
* @returns {CallbackTask} a task
* @example
* ```javascript
*   let Retry = require('callback-patterns/Retry');
*
*   let unstableTask = (next) => {
*     if (Math.random() > 0.9) { throw new Error(); }
*     else { next(); }
*   };
*
*   // attempt retries up to 10 times for up to 10000 ms ,
*   // with a constant retry delay of 100 ms between attempts
*   let stableTask = Retry(unstableTask, Retry.LinearRetryStrategy(100, 10, 10000));
*
*   // attempt retries up to 10 times for up to 10000 ms,
*   // with an exponential backoff retry delay of 100 ms, 200 ms, 400 ms, ...
*   let stableTask2 = Retry(unstableTask, Retry.ExponentialRetryStrategy(100, 10, 10000, 2));
*
*   // attempt retries up to 4 times,
*   // with retry delays of 100 ms, 100 ms, 100 ms, 1000ms
*   let stableTask3 = Retry(unstableTask, Retry.ManualRetryStrategy(100, 100, 100, 1000));
*
* ```
* @memberof callback-patterns
*/
function Retry(task : Task, retryStrategy ?: RetryOptions | DelayFunction) : Task {
	task = _catchWrapper(task || EMPTY_TASK);

	const delayFunc = typeof retryStrategy === 'function' ?
		retryStrategy : DefaultDelayBuilder(retryStrategy);

	return function _retryInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;

		var retryState = {
			err: undefined,
			retries: -1,
			delay: 0,
			timeStarted: Date.now(),
		};

		var onDone = function (err) {
			var res = arguments;
			if (err != null) {
				retryState.err = err;
				retryState.retries ++;
				retryState.delay = delayFunc(retryState);
				if (retryState.delay < 0) {
					next.apply(null, res as any);
				} else {
					_delay
						.bind(null, task, retryState.delay)
						.apply(null, args);
				}
			} else {
				next.apply(null, res as any);
			}
		};

		args[0] = onDone;
		args.length = args.length || 1;
		task.apply(null, args as any);
	};
}

Retry.LinearRetryStrategy = function (
	delay : number = 100,
	retries : number = 10,
	timeout : number = 10000) {

	const delayFunc : DelayFunction = function (args) {
		const elapsedTime = Date.now() - args.timeStarted;
		if (elapsedTime > timeout || args.retries > retries) {
			return -1;
		} else {
			return delay;
		}
	};

	return delayFunc;
};

Retry.ExponentialRetryStrategy = function (
	delay : number = 100,
	retries : number = 10,
	timeout : number = 10000,
	decayFactor : number = 2
) {

	const delayFunc : DelayFunction = function (args) {
		const elapsedTime = Date.now() - args.timeStarted;
		if (elapsedTime > timeout || args.retries > retries) {
			return -1;
		} else {
			const currentDelay = delay;
			delay = delay * decayFactor;
			return currentDelay;
		}
	};

	return delayFunc;
};

Retry.ManualRetryStrategy = function (
	...delays : number[]
) {

	const delayFunc : DelayFunction = function (args) {
		const elapsedTime = Date.now() - args.timeStarted;
		if (args.retries >= delays.length) {
			return -1;
		} else {
			const delay = delays[args.retries];
			return delay;
		}
	};

	return delayFunc;
};

export = Retry;
