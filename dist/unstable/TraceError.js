/* eslint-env node */

var _nullCallback = require('../_nullCallback');

var PassThrough = require('../PassThrough');

function _stackWrapper(_1, _2) {
	var callback = _1;
	var source = _2|| new Error('called from');

	return function __stackWrapperInstance(_1) {
		var err = _1;
		if (err && err.stack) {
			err.stack += '\n\n ';
			err.stack += source.stack;
		}
		callback.apply(undefined, arguments);
	};
}

/**
* ```javascript
*   let TraceError = require('callback-patterns/unstable/TraceError');
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task = TraceError(task);
*
*   task(next, ...args);
* ```
* TraceError is an experimental wrapper that attempts to make errors more informative,
* It does this by appending extra information to the stack of any error thrown in the task,
* if the stack exists.
*
* @param {taskFunction} task - a task function to wrap
* @returns {taskFunction} a wrapper function that modifies the stack trace of any errors thrown within
* @memberof callback-patterns.unstable
*/
var TraceError = function TraceError(_1) {
	var task = _1 || PassThrough;
	var constructorStack = new Error('called from');

	return function _TraceErrorInstance(_1) {
		var next = _1 || _nullCallback;
		next = _stackWrapper(next, constructorStack);
		arguments[0] = next;
		task.apply(undefined, arguments);
	};

};

TraceError.default = TraceError;

module.exports = TraceError;