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
*
* ```javascript
*   let task = TimeIn(
*     function(next, ...args) {},
*			1000
*   );
*
*   task(next, ...args);
* ```
*
* TimeIn wraps a single task function, and returns a function that only returns after X ms.
*
* @param {taskFunction} task - the task to wrap in a timeout.
* @param {number} ms - the timein in ms.
* @returns {taskFunction} a task
* @memberof callback-patterns
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

TimeIn.default = TimeIn;
module.exports = TimeIn;
