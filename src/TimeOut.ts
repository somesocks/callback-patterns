/* eslin-env node */

// import Callback from './types/Callback';
import Task from './types/Task';

import Race from './Race';
import PassThrough from './PassThrough';
import Delay from './Delay';
import InSeries from './InSeries';

function _error(next) {
	return next(new Error('callback-patterns.TimeOut triggered'));
}

/**
* TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.
*
* NOTE: the timeout being triggered will not cancel the original task.
*
* @param {CallbackTask} task - the task to wrap in a timeout.
* @param {number} ms - the timeout in ms.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let TimeOut = require('callback-patterns/TimeOut');
*
*   let chain = TimeOut(
*     function(next, ...args) {},
*			1000
*   );
*
*   chain(next, ...args);
* ```
*/
function TimeOut(_1 ?: Task, _2 ?: number) : Task {
	var task = _1 || PassThrough;
	var ms = _2 || 1000;

	var timeout = InSeries(
		Delay(ms),
		_error
	);

	return Race(timeout, task);
}

export = TimeOut;
