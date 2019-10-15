
// import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';
import _nullCallback from './_nullCallback';

import PassThrough from './PassThrough';

/**
* `If` accepts up to three tasks,
* an 'if' task, a 'then' task, and lastly an 'else' task
* note: by default, the ifTask, thenTask, and elseTask are PassThrough
* note: the ifTask can return multiple results,
* but only the first is checked for truthiness
* @param {CallbackTask} ifTask - a condition task.
* @param {CallbackTask} thenTask - a task to run when ifTask returns a truthy value.
* @param {CallbackTask} elseTask - a task to run when ifTask returns a falsy value.
* @returns {CallbackTask}
* @memberof callback-patterns
* @example
* ```javascript
*   let If = require('callback-patterns/If');
*
*   let logIfEven = If(
*     (next, num) => next(null, num % 2 === 0)
*     (next, num) => { console.log('is even!'); next(null, num); },
*     (next, num) => { console.log('is not even!'); next(null, num); },
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   logIfEven(null, 1); // prints out 'is not even!' eventually
*   logIfEven(null, 2); // prints out 'is even!' eventually
* ```
*/
function If(_1 ?: Task, _2 ?: Task, _3 ?: Task) : Task {
	var conditionTask = _1 != null ? _catchWrapper(_1) : PassThrough;
	var thenTask = _2 != null ? _catchWrapper(_2) : PassThrough;
	var elseTask = _3 != null ? _catchWrapper(_3) : PassThrough;

	return function _ifInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		var onCondition = function _onCondition(err, res) {
			if (err) {
				next(err, res);
			} else if (res) {
				args[0] = next;
				thenTask.apply(null, args as any);
			} else {
				args[0] = next;
				elseTask.apply(null, args as any);
			}
		};

		args[0] = onCondition;
		conditionTask.apply(null, args as any);
	};
}

export = If;
