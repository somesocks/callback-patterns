/* eslint-env node */

var _nullCallback = require('../_private/nullCallback');
var _stringWrapper = require('../_private/stringWrapper');

var _default = function () { return true; };


/**
*
* ```javascript
*   const Assert = require('callback-patterns/Assert');
*   const InSeries = require('callback-patterns/InSeries');
*
*   const task = InSeries(
*     (next, num) => next(null, num),
*     Assert(
*       (num) => (num >= 0),
*       (num) => `${num} is less than zero`
*     ),
*     (next, num) => next(null, num),
*   );
*
*   const onDone = (err, result) => console.log(err, result);
*
*   task(onDone, 1); // prints null 1, eventually
*   task(onDone, -1); // prints '-1 is less than zero', eventually
* ```
* Builds an async assertion task.  When called,
* if the arguments do not match the validator functions,
* Assert passes an error to its callback.
* @param {function} validator - a function that checks the arguments.
* @param {string} message - an optional error message to throw if the assertion fails, or a message builder function.
* @returns {taskFunction} an assertion task
* @memberof callback-patterns
*/
function Assert(_1, _2) {
	var validator = _1 || _default;
	var message = _2 || 'callback-patterns/Assert failed';
	message = _stringWrapper(message);

	return function _assertInstance(_1) {
		var next = _1 || _nullCallback;
		var args = arguments;
		var i;

		for (i = 0; i < args.length; i++) {
			args[i] = args[i+1];
		}
		args.length = args.length > 0 ? args.length - 1 : 0;

		var err;

		try {
			err = validator.apply(null, args) ?
				null :
				new Error(message.apply(null, args));
		} catch (e) {
			err = e;
		}

		args.length++;
		for (i = args.length - 1; i > 0; i--) {
			args[i] = args[i - 1];
		}
		args[0] = err;

		next.apply(null, args);
	};
}

Assert.default = Assert;

module.exports = Assert;
