/* eslin-env node */

var InParallel = require('./InParallel');
var PassThrough = require('./PassThrough');
var Delay = require('./Delay');
var InSeries = require('./InSeries');

function _empty(next) { return next(); }

function _results(next, r0, r1) {
	var args = r1;

	args.length++;
	for (var i = args.length - 1; i > 0; i--) {
		args[i] = args[i - 1];
	}
	args[0] = null;

	return next.apply(null, args);
}

/**
* TimeIn wraps a single task function, and returns a function that only returns after X ms.
*
* @param {CallbackTask} task - the task to wrap in a timeout.
* @param {number} ms - the timein in ms.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let TimeIn = require('callback-patterns/TimeIn');
*
*   let task = TimeIn(
*     function(next, ...args) {},
*			1000
*   );
*
*   task(next, ...args);
* ```
*/
function TimeIn(_1, _2) {
	var task = _1 || PassThrough;
	var ms = _2 || 1000;

	var timein = InSeries(
		InParallel(
			InSeries(
				_empty,
				Delay(ms)
			),
			task
		),
		_results
	);

	return timein;
}

module.exports = TimeIn;
