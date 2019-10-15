
// import Callback from './types/Callback';
import Task from './types/Task';

import _nullCallback from './_nullCallback';
import _defer from './_defer';
import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';

import PassThrough from './PassThrough';

var _false = function _false(next) { return next(null, false); };

/**
* While accepts two tasks and returns a task that conditionally executes some number of times.
* @param {function} conditionTask - a condition task.
* @param {function} loopTask - a task to run if the condition returns a truthy value.
* @returns {function}
* @memberof callback-patterns
* @example
* ```javascript
*   let While = require('callback-patterns/While');
*
*   let task = While(
*     (next, num) => next(null, num < 10),
*     (next, num) => next(null, num + 1),
*   );
*
*   let onDone = (err, result) => console.log(result);
*
*   task(onDone, 1); // prints 9, eventually
* ```
*/
function While(_1 ?: Task, _2 ?: Task) : Task {
	var conditionTask = _1 != null ? _catchWrapper(_1) : _false;
	var loopTask = _2 != null ? _catchWrapper(_2) : PassThrough;
	var deferredLoopTask = _defer.bind(null, loopTask);

	return function _whileInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		var onCondition;
		var onLoop;

		onCondition = function _onCondition(err, res) {
			if (err) {
				next(err, res);
			} else if (res) {
				args[0] = onLoop;
				args.length = args.length || 1;
				deferredLoopTask.apply(null, args);
			} else {
				args[0] = null;
				next.apply(null, args as any);
			}
		};

		onLoop = function _onLoop(err) {
			var args2 = arguments;
			if (err) {
				next.apply(null, args2 as any);
			} else {
				args = args2;
				args[0] = onCondition;
				args.length = args.length || 1;
				conditionTask.apply(null, args as any);
			}
		};

		args[0] = onCondition;
		args.length = args.length || 1;
		conditionTask.apply(null, args as any);
	};
}


export = While;
