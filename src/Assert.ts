/* eslint-env node */

import Task from './types/Task';

import _nullCallback from './_nullCallback';
import _stringWrapper from './_stringWrapper';

var _default = function () { return true; };


/**
* Builds an assertion task.  When called,
* if the arguments do not match the validator functions,
* Assert passes an error to its callback.
* @param {function} validator - a function that checks the arguments.
* @param {string} message - an optional error message to throw if the assertion fails, or a message builder function.
* @returns {CallbackTask} an assertion task
* @memberof callback-patterns
* @example
* ```javascript
*   let Assert = require('callback-patterns/Assert');
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     (next, num) => next(null, num),
*     Assert(
*       (num) => (num >= 0),
*       (num) => `${num} is less than zero`
*     ),
*     (next, num) => next(null, num),
*   );
*
*   let onDone = (err, result) => console.log(err, result);
*
*   task(onDone, 1); // prints null 1, eventually
*   task(onDone, -1); // prints '-1 is less than zero', eventually
* ```
*/
function Assert(_1, _2 ?: any) : Task {
	var validator = _1 || _default;
	var message = _2 || 'callback-patterns/Assert failed';
	message = _stringWrapper(message);

	return function _assertInstance(_1) {
		var next = _1 || _nullCallback;
		var args = arguments;
		var err;

		args[0] = undefined;

		try {
			err = validator.call.apply(validator, args) ? undefined : message.call.apply(message, args);
			err = (err == undefined || err instanceof Error) ? err : new Error(err);
		} catch (e) {
			err = e;
		}

		args[0] = err;

		next.apply(null, args as any);
	};
}

export = Assert;
