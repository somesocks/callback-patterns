/* eslin-env node */

var Race = require('./Race');
var PassThrough = require('./PassThrough');
var Delay = require('./Delay');
var InSeries = require('./InSeries');

function ERROR(next) {
	return next(new Error('callback-patterns.TimeOut triggered'));
}

/**
*
* ```javascript
*   let chain = TimeOut(
*     function(next, ...args) {},
*			1000
*   );
*
*   chain(next, ...args);
* ```
*
* TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.
*
* NOTE: the timeout being triggered will not cancel the original task.
*
* @param {taskFunction} task - the task to wrap in a timeout.
* @param {number} ms - the timeout in ms.
* @returns {taskFunction} a task
* @memberof callback-patterns
*/
function TimeOut(_1, _2) {
	var task = _1 || PassThrough;
	var ms = _2 || 1000;

	var timeout = InSeries(
		Delay(ms),
		ERROR
	);

	return Race(timeout, task);
}

TimeOut.default = TimeOut;
module.exports = TimeOut;
