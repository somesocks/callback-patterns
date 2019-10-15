
// import Callback from './types/Callback';
import Task from './types/Task';

import _nullCallback from './_nullCallback';
import _defer from './_defer';
import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';

var EMPTY = function (next) { return (next || _nullCallback)(); };

/**
* Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.
*
* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let Race = require('callback-patterns/Race');
*
*   let task = Race(
*     (next) => next(null, 1),
*     (next) => setTimeout(next, 100, null, 2),
*     (next) => { throw new Error(); } ,
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   task(onDone); // prints out [ 1 ], eventually
* ```
*/
function Race(...args : Task[]) : Task  {
	var tasks = arguments;

	if (tasks.length === 0) {
		return EMPTY;
	}

	for (var i = 0; i < tasks.length; i++) {
		tasks[i] = _catchWrapper(tasks[i]);
		tasks[i] = _defer.bind(null, tasks[i]);
	}

	return function _raceInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;
		args[0] = next;

		for (var i = 0; i < tasks.length; i++) {
			tasks[i].apply(null, args);
		}
	};
}

export = Race;
