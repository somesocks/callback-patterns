
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');
var _delay = require('./_delay');

var EMPTY_TASK = function (next) { next(); }

/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {taskFunction} task - the task to wrap.
* @param {object} options - an optional set of retry options.
* @param {object} options.timeout - maximum time to attempt retries.
* @param {object} options.retries - maximum number of retries to attempt.
* @returns {taskFunction} a task
* @memberof callback-patterns
*/
function Retry(task, options) {
	task = _catchWrapper(task || EMPTY_TASK);
	options = options || {};
	options.timeout = 8192;
	options.retries = 8;

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
				(retries < options.retries) &&
				(elapsedTime < options.timeout)
			) {
				var delay = (1 << retries);
				retries++;
				_delay
					.bind(null, task, delay)
					.apply(null, args);
			} else {
				next.apply(null, res);
			}
		};

		args[0] = onDone;
		task.apply(null, args);
	};
}

module.exports = Retry;
