
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');
var _defer = require('./_defer');
var Queue = require('./_queue');


var InSeries = require('./InSeries');
var PassThrough = require('./PassThrough');

/**
* Wraps a task and ensures that only X number of instances of the task can be run in parallel.
* Requests are queued up in an unbounded FIFO queue until they can be run.
* @param {CallbackTask} task - the task to throttle
* @param {number} limit - the number of instances that can run in parallel. default 1.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Throttle(_1, _2) {
	var task = _1 || PassThrough;
	var limit = _2 || 1;

	var queue = new Throttle.Queue();
	var running = 0;

	var _throttleInstance;
	var _deferredThrottleInstance;

	_throttleInstance = function _throttleInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;

		var after = function() {
			var results = arguments;
			running--;
			if (running < limit && queue.length() > 0) {
				var oldArgs = queue.pop();
				_deferredThrottleInstance.apply(null, oldArgs);
			}

			next.apply(null, results);
		};

		if (running < limit) {
			running++;
			args[0] = after;
			task.apply(null, args);
		} else {
			queue.push(args);
		}
	};

	_deferredThrottleInstance = _defer.bind(null, _throttleInstance);

	return _throttleInstance;
}

Throttle.Queue = Queue;

module.exports = Throttle;
