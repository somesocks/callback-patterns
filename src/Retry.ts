
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

/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {CallbackTask} task - the task to wrap.
* @param {object} options - an optional set of retry options.
* @param {object} options.timeout - maximum time to attempt retries.
* @param {object} options.retries - maximum number of retries to attempt.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Retry(task : Task, options ?: RetryOptions) : Task {
	task = _catchWrapper(task || EMPTY_TASK);
	options = options || {};

	const timeout = options.timeout || 8192;
	const retries = options.retries || 8;

	return function _retryInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;

		var timeStarted = Date.now();
		var retries = 0;

		var onDone = function (err) {
			var elapsedTime = Date.now() - timeStarted;
			var res = arguments;
			if (
				(err != null) &&
				(retries < retries) &&
				(elapsedTime < timeout)
			) {
				var delay = (1 << retries);
				retries++;
				_delay
					.bind(null, task, delay)
					.apply(null, args);
			} else {
				next.apply(null, res as any);
			}
		};

		args[0] = onDone;
		task.apply(null, args as any);
	};
}

export = Retry;
